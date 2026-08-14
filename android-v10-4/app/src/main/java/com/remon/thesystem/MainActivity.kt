package com.remon.thesystem

import android.app.AlertDialog
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.InputType
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import kotlin.math.roundToInt

class MainActivity : ComponentActivity() {
    private lateinit var store: GameStore
    private lateinit var battle: BattleEngine
    private lateinit var content: LinearLayout
    private lateinit var root: LinearLayout
    private lateinit var topStatus: TextView
    private var screen = "HUD"
    private var healthClient: HealthConnectClient? = null
    private val stepPermission = HealthPermission.getReadPermission(StepsRecord::class)

    private val bg = Color.rgb(2, 6, 13)
    private val panel = Color.rgb(6, 18, 31)
    private val blue = Color.rgb(128, 234, 255)
    private val green = Color.rgb(72, 255, 173)
    private val muted = Color.rgb(145, 168, 185)
    private val red = Color.rgb(255, 93, 134)
    private val gold = Color.rgb(255, 215, 123)

    private val requestHealth = registerForActivityResult(PermissionController.createRequestPermissionResultContract()) { granted ->
        if (granted.contains(stepPermission)) readSteps() else toast("Steps permission not granted")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        store = GameStore(this)
        battle = BattleEngine(store)
        if (HealthConnectClient.getSdkStatus(this) == HealthConnectClient.SDK_AVAILABLE) healthClient = HealthConnectClient.getOrCreate(this)
        buildShell()
        show("HUD")
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() { if (screen != "HUD") show("HUD") else finish() }
        })
    }

    private fun buildShell() {
        root = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setBackgroundColor(bg) }
        topStatus = TextView(this).apply {
            setTextColor(blue); textSize = 13f; gravity = Gravity.CENTER; setPadding(12, 18, 12, 14)
            typeface = Typeface.DEFAULT_BOLD
        }
        root.addView(topStatus, LinearLayout.LayoutParams(-1, -2))
        val scroll = ScrollView(this).apply { isFillViewport = true }
        content = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(12, 6, 12, 18) }
        scroll.addView(content, ViewGroup.LayoutParams(-1, -2))
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        val nav = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; setPadding(6, 6, 6, 10); setBackgroundColor(Color.rgb(2,10,18)) }
        listOf("HUD","QUEST","DAILY","GATE","SHOP","STATUS").forEach { name ->
            nav.addView(navButton(name), LinearLayout.LayoutParams(0, 58.dp, 1f))
        }
        root.addView(nav, LinearLayout.LayoutParams(-1, -2)); setContentView(root)
    }

    private fun navButton(name: String) = Button(this).apply {
        text = name; textSize = 9f; setTextColor(muted); background = bordered(Color.rgb(4,14,24), Color.rgb(30,72,92), 1)
        setOnClickListener { show(name) }
    }

    private fun show(name: String) {
        screen = name; content.removeAllViews(); updateTop()
        when(name){
            "HUD" -> renderHud()
            "QUEST" -> renderQuests()
            "DAILY" -> renderDaily()
            "GATE" -> renderGate()
            "SHOP" -> renderShop()
            "STATUS" -> renderStatus()
        }
    }

    private fun updateTop() {
        topStatus.text = "THE SYSTEM  •  Lv.${store.level}  •  ${store.gold}G  •  Keys ${store.eKeys}/${store.dKeys}/${store.cKeys}  •  SYS ${100-store.fatigue}%"
    }

    private fun title(text: String) = TextView(this).apply {
        this.text = text; setTextColor(Color.WHITE); textSize = 22f; gravity = Gravity.CENTER; typeface = Typeface.DEFAULT_BOLD
        letterSpacing = .12f; setPadding(12, 14, 12, 14); background = bordered(panel, Color.rgb(45,93,115), 1)
    }
    private fun label(text: String, color: Int = Color.WHITE, size: Float = 15f) = TextView(this).apply {
        this.text=text;setTextColor(color);textSize=size;setPadding(8,6,8,6)
    }
    private fun panelBox(): LinearLayout = LinearLayout(this).apply {
        orientation=LinearLayout.VERTICAL;setPadding(12,12,12,12);background=bordered(panel,Color.rgb(38,80,100),1)
    }
    private fun action(text:String, color:Int=blue, onClick:()->Unit)=Button(this).apply{
        this.text=text;setTextColor(color);textSize=12f;background=bordered(Color.rgb(4,14,24),Color.rgb(45,93,115),1);setOnClickListener{onClick()}
    }
    private fun addSection(view:View){content.addView(view,LinearLayout.LayoutParams(-1,-2).apply{setMargins(0,0,0,10)})}

    private fun renderHud() {
        addSection(title("STATUS"))
        val p=panelBox();p.addView(label("LEVEL ${store.level}",blue,34f));p.addView(label("JOB: ${store.job}\nTITLE: ${store.title}\nPOWER: ${store.power}\nHP ${store.hp}/${store.maxHp}  •  MP ${store.mp}/${store.maxMp}\nXP ${store.xp}/${store.nextXp}\nABILITY POINTS ${store.abilityPoints}",muted,14f));addSection(p)
        val active=store.quests.firstOrNull{it.id==store.activeQuestId}
        val a=panelBox();a.addView(label(active?.name?.uppercase() ?: "NO QUEST ACTIVE",Color.WHITE,20f));a.addView(label(active?.description ?: "Accept a real-life quest. Quests are your main XP and Gate Key source.",muted,13f))
        if(active!=null){a.addView(action("CLAIM QUEST",green){store.completeQuest(active);toast("Quest complete: +${active.xp} XP, +${active.gold} Gold");show("HUD")})}
        addSection(a)
        addSection(title("AVAILABLE QUESTS"));store.quests.filter{questAvailable(it)}.take(3).forEach{q->addSection(questRow(q))}
    }

    private fun questAvailable(q:Quest)= q.doneDate!=store.today() && q.refusedDate!=store.today() && (q.postponedUntil.isBlank() || q.postponedUntil<=store.today())

    private fun questRow(q:Quest):View{
        val box=panelBox();box.addView(label(q.name,Color.WHITE,17f));box.addView(label("${q.description}\n${q.minutes} min • +${q.xp} XP • +${q.gold} Gold",muted,12f))
        val row=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL}
        row.addView(action("ACCEPT",green){store.activeQuestId=q.id;store.activeQuestStartedAt=System.currentTimeMillis();store.save();toast("Quest accepted");show("HUD")},LinearLayout.LayoutParams(0,48.dp,1f))
        row.addView(action("REFUSE",red){q.refusedDate=store.today();store.save();show(screen)},LinearLayout.LayoutParams(0,48.dp,1f))
        box.addView(row);return box
    }

    private fun renderQuests(){
        addSection(title("QUEST INFO"));addSection(action("+ CREATE QUEST",green){questEditor()})
        store.quests.forEach{addSection(questRow(it))}
    }

    private fun questEditor(){
        val wrap=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(20,8,20,0)}
        val name=EditText(this).apply{hint="Quest name"};val desc=EditText(this).apply{hint="Description"};val mins=EditText(this).apply{hint="Minutes";inputType=2};val xp=EditText(this).apply{hint="XP";inputType=2}
        listOf(name,desc,mins,xp).forEach{wrap.addView(it)}
        AlertDialog.Builder(this).setTitle("CREATE QUEST").setView(wrap).setPositiveButton("CREATE"){_,_->
            val n=name.text.toString().trim();if(n.isNotEmpty()){store.quests.add(Quest("q${System.currentTimeMillis()}",n,desc.text.toString(),xp.text.toString().toIntOrNull()?:35,60,mins.text.toString().toIntOrNull()?:30,"custom","vit"));store.save();show("QUEST")}
        }.setNegativeButton("CANCEL",null).show()
    }

    private fun renderDaily(){
        addSection(title("DAILY QUEST"));val modes=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL}
        listOf("low","normal","high").forEach{m->modes.addView(action(m.uppercase(),if(store.dailyMode==m)green else blue){store.setDailyPreset(m);show("DAILY")},LinearLayout.LayoutParams(0,48.dp,1f))};addSection(modes)
        store.daily.forEach{task->
            val box=panelBox();box.addView(label(task.name,Color.WHITE,16f));val row=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL;gravity=Gravity.CENTER_VERTICAL}
            val input=EditText(this).apply{setText(format(task.progress));setTextColor(Color.WHITE);inputType=InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL;setSelectAllOnFocus(true)}
            row.addView(input,LinearLayout.LayoutParams(0,48.dp,1f));row.addView(label(" / ${format(task.goal)} ${task.unit}",muted,13f),LinearLayout.LayoutParams(0,48.dp,1f))
            row.addView(action("SET",green){task.progress=input.text.toString().toDoubleOrNull()?:task.progress;store.save();show("DAILY")},LinearLayout.LayoutParams(85.dp,48.dp));box.addView(row);addSection(box)
        }
        val health=panelBox();health.addView(label("HEALTH CONNECT",blue,16f));health.addView(label("Synchroniseer stappen uit Samsung Health via Health Connect.",muted,12f));health.addView(action("SYNC TODAY'S STEPS",green){requestSteps()});addSection(health)
        addSection(action("CLAIM DAILY  •  +1 D-RANK KEY",green){if(store.canClaimDaily()){store.claimDaily();toast("Daily Quest complete");show("DAILY")}else toast("Daily Quest is nog niet compleet")})
        addSection(action("RECOVERY DAY",gold){store.recoveryDate=store.today();store.save();toast("Recovery Day: no penalty")})
    }

    private fun format(v:Double)=if(v%1.0==0.0)v.toInt().toString() else String.format("%.1f",v)

    private fun renderGate(){
        if(battle.logs.isNotEmpty() && !battle.finished){renderBattleScreen();return}
        addSection(title("GATE ACCESS"))
        addSection(label("Your Power ${store.power}. E-Rank is designed to be dangerous at low level: read intents, use Guard and manage Break.",muted,13f))
        gateButton("E-RANK GATE", "Recommended Power 130 • Key ${store.eKeys}", green){if(store.eKeys>0){store.eKeys--;store.save();battle.start("E");renderBattleScreen()}else toast("No E-Rank key")}
        gateButton("D-RANK GATE", "Recommended Power 230 • Key ${store.dKeys}", Color.rgb(197,166,255)){if(store.dKeys>0){store.dKeys--;store.save();battle.start("D");renderBattleScreen()}else toast("No D-Rank key")}
        gateButton("C-RANK GATE", "Recommended Power 380 • Key ${store.cKeys}", gold){if(store.cKeys>0){store.cKeys--;store.save();battle.start("C");renderBattleScreen()}else toast("No C-Rank key")}
        addSection(action("TRAINING BATTLE",blue){battle.start("E");renderBattleScreen()})
    }

    private fun gateButton(name:String,sub:String,color:Int,start:()->Unit){val b=panelBox();b.addView(label(name,color,18f));b.addView(label(sub,muted,12f));b.addView(action("ENTER GATE",color,start));addSection(b)}

    private fun renderBattleScreen(){
        content.removeAllViews();updateTop();val s=battle.snapshot();addSection(title("${battle.gateRank}-RANK BATTLE • ROUND ${s.round}"))
        val enemy=panelBox();enemy.addView(label(s.enemyName,red,22f));enemy.addView(label("HP ${s.enemyHp}/${s.enemyMaxHp}\nBREAK ${s.enemyBreak}/${s.enemyBreakMax}",Color.WHITE,14f));enemy.addView(progress(s.enemyHp,s.enemyMaxHp,red));enemy.addView(progress(s.enemyBreak,s.enemyBreakMax,Color.rgb(197,166,255)));addSection(enemy)
        val intent=panelBox();intent.addView(label("INTENT: ${s.intent.name}",gold,17f));intent.addView(label(if(s.analyzed)"${s.intent.minDamage}-${s.intent.maxDamage} dmg • ${s.intent.tag}${if(s.intent.interruptBreak>0)" • interrupt ${s.intent.interruptBreak} Break" else ""}" else "Analyze to reveal damage and interrupt threshold.",muted,12f));addSection(intent)
        val player=panelBox();player.addView(label("PLAYER • AP ${s.ap}/2",blue,17f));player.addView(label("HP ${s.playerHp}/${store.maxHp} • MP ${s.playerMp}/${store.maxMp}${if(s.bleedTurns>0)" • BLEED ${s.bleedTurns}" else ""}${if(s.broken)" • ENEMY BROKEN" else ""}",Color.WHITE,13f));addSection(player)
        if(s.finished){addSection(label(if(s.victory)"GATE CLEARED" else "DEFEAT",if(s.victory)green else red,26f));addSection(action("RETURN TO GATE LIST",green){show("GATE")});addBattleLog(s);return}
        val buttons=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL}
        val r1=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};r1.addView(action("ATTACK • 1 AP",blue){timingDialog("STRIKE"){q->battle.attack(q);renderBattleScreen()}},LinearLayout.LayoutParams(0,52.dp,1f));r1.addView(action("GUARD • 1 AP",gold){timingDialog("GUARD"){q->battle.guard(q);renderBattleScreen()}},LinearLayout.LayoutParams(0,52.dp,1f));buttons.addView(r1)
        val r2=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};r2.addView(action("ANALYZE • 1 AP",Color.WHITE){toast(battle.analyze());renderBattleScreen()},LinearLayout.LayoutParams(0,52.dp,1f));r2.addView(action("DAGGER RUSH",Color.rgb(197,166,255)){toast(battle.daggerRush());renderBattleScreen()},LinearLayout.LayoutParams(0,52.dp,1f));buttons.addView(r2)
        val r3=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};r3.addView(action("VITAL STRIKE",red){timingDialog("VITAL STRIKE"){q->toast(battle.vitalStrike(q));renderBattleScreen()}},LinearLayout.LayoutParams(0,52.dp,1f));r3.addView(action("END TURN",muted){battle.endTurn();renderBattleScreen()},LinearLayout.LayoutParams(0,52.dp,1f));buttons.addView(r3)
        val r4=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};r4.addView(action("HEAL POTION",green){toast(battle.potion("Healing Potion"));renderBattleScreen()},LinearLayout.LayoutParams(0,52.dp,1f));r4.addView(action("MANA POTION",blue){toast(battle.potion("Mana Potion"));renderBattleScreen()},LinearLayout.LayoutParams(0,52.dp,1f));buttons.addView(r4);addSection(buttons);addBattleLog(s)
    }

    private fun addBattleLog(s:BattleSnapshot){val log=panelBox();log.addView(label("COMBAT LOG",blue,15f));s.log.take(12).forEach{log.addView(label(it,muted,11f))};addSection(log)}

    private fun timingDialog(title:String,callback:(String)->Unit){
        val wrap=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(24,18,24,4)}
        val info=label("Tap when the marker is near the center.\nGold = PERFECT • Blue = GOOD",muted,13f);wrap.addView(info)
        val progress=ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal).apply{max=100;progress=0;minimumHeight=28.dp};wrap.addView(progress,LinearLayout.LayoutParams(-1,32.dp))
        val dialog=AlertDialog.Builder(this).setTitle(title).setView(wrap).setPositiveButton("STRIKE",null).setNegativeButton("CANCEL",null).create()
        val handler=Handler(Looper.getMainLooper());var pos=0;var dir=1
        val tick=object:Runnable{override fun run(){if(!dialog.isShowing)return;pos+=dir*4;if(pos>=100){pos=100;dir=-1};if(pos<=0){pos=0;dir=1};progress.progress=pos;handler.postDelayed(this,28)}}
        dialog.setOnShowListener{
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener{
                val quality=if(pos in 46..54)"PERFECT" else if(pos in 30..70)"GOOD" else "MISS";handler.removeCallbacks(tick);dialog.dismiss();callback(quality)
            };handler.post(tick)
        }
        dialog.setOnDismissListener{handler.removeCallbacks(tick)};dialog.show()
    }

    private fun renderShop(){
        addSection(title("SYSTEM SHOP"));addSection(label("Gold: ${store.gold}",gold,18f))
        shopItem("Healing Potion","Restore 45 HP in battle",35){store.consumables["Healing Potion"]=(store.consumables["Healing Potion"]?:0)+1}
        shopItem("Mana Potion","Restore 30 MP in battle",40){store.consumables["Mana Potion"]=(store.consumables["Mana Potion"]?:0)+1}
        shopItem("Ability Point","Permanent stat point",250){store.abilityPoints++}
        shopItem("E-Rank Gate Key","Opens an E-Rank Gate",180){store.eKeys++}
    }

    private fun shopItem(name:String,desc:String,price:Int,grant:()->Unit){val b=panelBox();b.addView(label(name,Color.WHITE,16f));b.addView(label(desc,muted,12f));b.addView(action("BUY • $price G",gold){if(store.gold>=price){store.gold-=price;grant();store.save();toast("$name purchased");show("SHOP")}else toast("Not enough Gold")});addSection(b)}

    private fun renderStatus(){
        addSection(title("PLAYER STATUS"));val p=panelBox();p.addView(label("LEVEL ${store.level} • ${store.job}\nTITLE ${store.title}\nPOWER ${store.power}\nHP ${store.hp}/${store.maxHp} • MP ${store.mp}/${store.maxMp}\nFATIGUE ${store.fatigue}\nABILITY POINTS ${store.abilityPoints}",muted,15f));addSection(p)
        listOf("STR" to store.str,"VIT" to store.vit,"AGI" to store.agi,"INT" to store.intStat,"PER" to store.per).forEach{(stat,value)->addSection(action("$stat  $value  •  +1",green){if(store.allocate(stat))show("STATUS")else toast("No Ability Points")})}
        addSection(action("SAVE",blue){store.save();toast("Saved")});addSection(action("RESET ALL DATA",red){AlertDialog.Builder(this).setTitle("Reset all progress?").setPositiveButton("RESET"){_,_->store.reset();recreate()}.setNegativeButton("CANCEL",null).show()})
    }

    private fun progress(value:Int,max:Int,color:Int)=ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal).apply{this.max=max.coerceAtLeast(1);progress=value.coerceIn(0,this.max);progressTintList=android.content.res.ColorStateList.valueOf(color)}

    private fun requestSteps(){
        val client=healthClient;if(client==null){toast("Health Connect unavailable");return}
        lifecycleScope.launch{try{val granted=client.permissionController.getGrantedPermissions();if(granted.contains(stepPermission))readSteps()else requestHealth.launch(setOf(stepPermission))}catch(t:Throwable){toast("Health Connect error")}}
    }
    private fun readSteps(){
        val client=healthClient?:return;lifecycleScope.launch{try{val zone=ZoneId.systemDefault();val start=LocalDate.now(zone).atStartOfDay(zone).toInstant();val r=client.aggregate(AggregateRequest(metrics=setOf(StepsRecord.COUNT_TOTAL),timeRangeFilter=TimeRangeFilter.between(start,Instant.now())));val steps=r[StepsRecord.COUNT_TOTAL]?:0L;store.ensureStepsTask(steps);toast("$steps steps synced");show("DAILY")}catch(t:Throwable){toast("Could not read steps")}}
    }

    private fun toast(text:String)=Toast.makeText(this,text,Toast.LENGTH_SHORT).show()
    private fun bordered(fill:Int,stroke:Int,width:Int)=GradientDrawable().apply{setColor(fill);setStroke(width.dp,stroke);cornerRadius=2f}
    private val Int.dp:Int get()=(this*resources.displayMetrics.density).roundToInt()
}
