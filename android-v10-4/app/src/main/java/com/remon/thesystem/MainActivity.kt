package com.remon.thesystem

import android.app.AlertDialog
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.text.InputType
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.view.WindowInsets
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
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

class MainActivity : ComponentActivity() {
    private lateinit var store: GameStore
    private lateinit var battle: BattleEngine
    private lateinit var root: LinearLayout
    private lateinit var content: LinearLayout
    private lateinit var topStatus: TextView
    private lateinit var nav: LinearLayout
    private var screen = "HUD"
    private var healthClient: HealthConnectClient? = null
    private val stepPermission = HealthPermission.getReadPermission(StepsRecord::class)

    private val bg = Color.rgb(1, 4, 9)
    private val blue = Color.rgb(128, 234, 255)
    private val green = Color.rgb(72, 255, 173)
    private val muted = Color.rgb(132, 158, 177)
    private val red = Color.rgb(255, 93, 134)
    private val gold = Color.rgb(255, 215, 123)
    private val purple = Color.rgb(197, 166, 255)

    private val screenWidthDp: Float get() = resources.displayMetrics.widthPixels / resources.displayMetrics.density
    private val compact: Boolean get() = screenWidthDp < 380f
    private val sidePad: Int get() = (if (compact) 10 else 14).dp
    private fun sp(base: Float): Float = base * (screenWidthDp / 412f).coerceIn(.88f, 1.12f)

    private val requestHealth = registerForActivityResult(PermissionController.createRequestPermissionResultContract()) { granted ->
        if (granted.contains(stepPermission)) readSteps() else toast("Steps permission not granted")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = bg
        window.navigationBarColor = bg
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
        root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(bg)
            setOnApplyWindowInsetsListener { v, insets ->
                val bars = insets.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
                v.setPadding(0, bars.top, 0, bars.bottom)
                insets
            }
        }

        topStatus = TextView(this).apply {
            setTextColor(blue); textSize = sp(11f); gravity = Gravity.CENTER
            typeface = Typeface.create(Typeface.DEFAULT, Typeface.BOLD)
            letterSpacing = .12f
            setPadding(sidePad, 10.dp, sidePad, 8.dp)
        }
        root.addView(topStatus, LinearLayout.LayoutParams(-1, -2))

        val hairline = View(this).apply { setBackgroundColor(Color.argb(95,128,234,255)) }
        root.addView(hairline, LinearLayout.LayoutParams(-1, 1.dp))

        val scroll = ScrollView(this).apply { isFillViewport = true; overScrollMode = View.OVER_SCROLL_NEVER }
        content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(sidePad, 12.dp, sidePad, 18.dp)
            gravity = Gravity.TOP
        }
        scroll.addView(content, ViewGroup.LayoutParams(-1, -2))
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))

        nav = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            setPadding(5.dp, 5.dp, 5.dp, 5.dp)
            setBackgroundColor(Color.rgb(2, 9, 16))
        }
        listOf("HUD","QUEST","DAILY","GATE","SHOP","STATUS").forEach { name ->
            nav.addView(navButton(name), LinearLayout.LayoutParams(0, if(compact) 50.dp else 56.dp, 1f))
        }
        root.addView(nav, LinearLayout.LayoutParams(-1, -2))
        setContentView(root)
    }

    private fun navButton(name: String) = TextView(this).apply {
        text = name; gravity = Gravity.CENTER; textSize = sp(if(compact) 8f else 9f)
        setTextColor(muted); isClickable = true; isFocusable = true
        letterSpacing = .08f; setPadding(2.dp, 4.dp, 2.dp, 4.dp)
        setOnClickListener { show(name) }
    }

    private fun show(name: String) {
        screen = name; content.removeAllViews(); updateTop(); updateNav()
        when(name){
            "HUD" -> renderHud(); "QUEST" -> renderQuests(); "DAILY" -> renderDaily()
            "GATE" -> renderGate(); "SHOP" -> renderShop(); "STATUS" -> renderStatus()
        }
    }

    private fun updateNav() {
        for(i in 0 until nav.childCount){
            val v=nav.getChildAt(i) as TextView
            val active=v.text.toString()==screen
            v.setTextColor(if(active) Color.WHITE else muted)
            v.setBackgroundResource(if(active) R.drawable.system_panel else android.R.color.transparent)
        }
    }

    private fun updateTop() {
        topStatus.text = "THE SYSTEM   •   LV.${store.level}   •   ${store.gold} G   •   KEYS ${store.eKeys}/${store.dKeys}/${store.cKeys}   •   SYS ${100-store.fatigue}%"
    }

    private fun systemTitle(text:String, sub:String?=null): View {
        val wrap=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;gravity=Gravity.CENTER;setPadding(4.dp,8.dp,4.dp,14.dp)}
        wrap.addView(TextView(this).apply{
            this.text=text;gravity=Gravity.CENTER;setTextColor(Color.WHITE);textSize=sp(if(compact)20f else 23f)
            typeface=Typeface.create(Typeface.DEFAULT,Typeface.BOLD);letterSpacing=.16f
        })
        if(sub!=null)wrap.addView(TextView(this).apply{this.text=sub;gravity=Gravity.CENTER;setTextColor(muted);textSize=sp(9f);letterSpacing=.11f;setPadding(0,5.dp,0,0)})
        return wrap
    }

    private fun panelBox(): LinearLayout = LinearLayout(this).apply {
        orientation=LinearLayout.VERTICAL; setPadding(if(compact)12.dp else 16.dp,14.dp,if(compact)12.dp else 16.dp,14.dp)
        setBackgroundResource(R.drawable.system_panel)
    }

    private fun label(text:String,color:Int=Color.WHITE,size:Float=14f,center:Boolean=false)=TextView(this).apply{
        this.text=text;setTextColor(color);textSize=sp(size);gravity=if(center)Gravity.CENTER else Gravity.START
        setLineSpacing(2.dp.toFloat(),1f);setPadding(3.dp,4.dp,3.dp,4.dp)
    }

    private fun action(text:String,color:Int=blue,onClick:()->Unit)=TextView(this).apply{
        this.text=text;gravity=Gravity.CENTER;setTextColor(color);textSize=sp(11f);typeface=Typeface.DEFAULT_BOLD
        letterSpacing=.06f;minHeight=if(compact)44.dp else 48.dp;setPadding(8.dp,8.dp,8.dp,8.dp)
        setBackgroundResource(R.drawable.system_button);isClickable=true;isFocusable=true;setOnClickListener{onClick()}
    }

    private fun addSection(v:View, gap:Int=10){content.addView(v,LinearLayout.LayoutParams(-1,-2).apply{setMargins(0,0,0,gap.dp)})}

    private fun statBar(value:Int,maxValue:Int,color:Int):View{
        val box=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(0,3.dp,0,3.dp)}
        val bar=ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal).apply{
            max=max(1,maxValue);progress=value.coerceIn(0,max);progressTintList=ColorStateList.valueOf(color);progressBackgroundTintList=ColorStateList.valueOf(Color.argb(45,255,255,255));minimumHeight=6.dp
        }
        box.addView(bar,LinearLayout.LayoutParams(-1,6.dp));return box
    }

    private fun renderHud(){
        addSection(systemTitle("STATUS","PLAYER INFORMATION"),4)
        val p=panelBox();
        val level=label(store.level.toString(),Color.WHITE,if(compact)54f else 68f,true).apply{typeface=Typeface.DEFAULT_BOLD}
        p.addView(level);p.addView(label("LEVEL",blue,10f,true));p.addView(space(7))
        p.addView(label("JOB     ${store.job}\nTITLE   ${store.title}\nPOWER   ${store.power}",muted,13f,true));p.addView(space(10))
        p.addView(label("HP   ${store.hp} / ${store.maxHp}",Color.WHITE,11f));p.addView(statBar(store.hp,store.maxHp,green))
        p.addView(label("MP   ${store.mp} / ${store.maxMp}",Color.WHITE,11f));p.addView(statBar(store.mp,store.maxMp,blue))
        p.addView(label("XP   ${store.xp} / ${store.nextXp}",Color.WHITE,11f));p.addView(statBar(store.xp,store.nextXp,purple))
        p.addView(label("FATIGUE ${store.fatigue}%   •   ABILITY POINTS ${store.abilityPoints}",muted,10f,true))
        addSection(p,14)

        val active=store.quests.firstOrNull{it.id==store.activeQuestId}
        val a=panelBox();a.addView(label(if(active==null)"NO QUEST ACTIVE" else "CURRENT QUEST",blue,10f,true))
        a.addView(label(active?.name?.uppercase() ?: "SYSTEM STANDBY",Color.WHITE,if(compact)18f else 21f,true))
        a.addView(label(active?.description ?: "Complete real-life quests to receive experience, Gold and Gate Keys.",muted,12f,true))
        if(active!=null){a.addView(space(7));a.addView(action("CLAIM REWARD",green){store.completeQuest(active);toast("Quest complete: +${active.xp} XP");show("HUD")})}
        addSection(a,16)

        addSection(systemTitle("AVAILABLE QUESTS",null),4)
        store.quests.filter{questAvailable(it)}.take(if(compact)3 else 4).forEach{addSection(questRow(it),7)}
    }

    private fun questAvailable(q:Quest)=q.doneDate!=store.today()&&q.refusedDate!=store.today()&&(q.postponedUntil.isBlank()||q.postponedUntil<=store.today())

    private fun questRow(q:Quest):View{
        val box=panelBox();
        val rank=when{q.xp>=70->"A";q.xp>=50->"B";q.xp>=35->"C";q.xp>=25->"D";else->"E"}
        box.addView(label("[$rank-RANK]  ${q.name.uppercase()}",Color.WHITE,14f))
        box.addView(label(q.description,muted,11f));box.addView(label("${q.minutes} MIN   •   +${q.xp} XP   •   +${q.gold} G",blue,9f))
        val row=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL;setPadding(0,7.dp,0,0)}
        row.addView(action("ACCEPT",green){store.activeQuestId=q.id;store.activeQuestStartedAt=System.currentTimeMillis();store.save();show("HUD")},LinearLayout.LayoutParams(0,46.dp,1f).apply{marginEnd=4.dp})
        row.addView(action("REFUSE",red){q.refusedDate=store.today();store.save();show(screen)},LinearLayout.LayoutParams(0,46.dp,1f).apply{marginStart=4.dp})
        box.addView(row);return box
    }

    private fun renderQuests(){
        addSection(systemTitle("QUEST INFO","SYSTEM DIRECTIVES"),4);addSection(action("+ CREATE CUSTOM QUEST",green){questEditor()},12)
        store.quests.forEach{addSection(questRow(it),7)}
    }

    private fun questEditor(){
        val wrap=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(18.dp,8.dp,18.dp,0);setBackgroundColor(bg)}
        fun input(h:String,numeric:Boolean=false)=EditText(this).apply{hint=h;setHintTextColor(muted);setTextColor(Color.WHITE);textSize=sp(13f);setBackgroundResource(R.drawable.system_input);if(numeric)inputType=InputType.TYPE_CLASS_NUMBER;setPadding(10.dp,8.dp,10.dp,8.dp)}
        val name=input("Quest name");val desc=input("Description");val mins=input("Minutes",true);val xp=input("XP",true)
        listOf(name,desc,mins,xp).forEach{wrap.addView(it,LinearLayout.LayoutParams(-1,50.dp).apply{setMargins(0,0,0,7.dp)})}
        AlertDialog.Builder(this).setTitle("SYSTEM // CREATE QUEST").setView(wrap).setPositiveButton("CREATE"){_,_->
            val n=name.text.toString().trim();if(n.isNotEmpty()){store.quests.add(Quest("q${System.currentTimeMillis()}",n,desc.text.toString(),xp.text.toString().toIntOrNull()?:35,60,mins.text.toString().toIntOrNull()?:30,"custom","vit"));store.save();show("QUEST")}
        }.setNegativeButton("CANCEL",null).show()
    }

    private fun renderDaily(){
        addSection(systemTitle("DAILY QUEST","STRENGTHEN THE PLAYER"),4)
        val modes=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL}
        listOf("low","normal","high").forEach{m->modes.addView(action(m.uppercase(),if(store.dailyMode==m)green else muted){store.setDailyPreset(m);show("DAILY")},LinearLayout.LayoutParams(0,44.dp,1f).apply{setMargins(2.dp,0,2.dp,0)})};addSection(modes,12)
        store.daily.forEach{task->
            val box=panelBox();box.addView(label(task.name.uppercase(),Color.WHITE,13f));
            val row=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL;gravity=Gravity.CENTER_VERTICAL}
            val input=EditText(this).apply{setText(format(task.progress));setTextColor(Color.WHITE);textSize=sp(13f);gravity=Gravity.CENTER;inputType=InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL;setBackgroundResource(R.drawable.system_input);setSelectAllOnFocus(true)}
            row.addView(input,LinearLayout.LayoutParams(0,44.dp,1f));row.addView(label(" / ${format(task.goal)} ${task.unit.uppercase()}",muted,11f,true),LinearLayout.LayoutParams(0,44.dp,1f));row.addView(action("SET",green){task.progress=input.text.toString().toDoubleOrNull()?:task.progress;store.save();show("DAILY")},LinearLayout.LayoutParams(78.dp,44.dp));box.addView(row);addSection(box,7)
        }
        val health=panelBox();health.addView(label("HEALTH CONNECT",blue,12f,true));health.addView(label("Samsung Health steps can be synchronized directly into today's Daily Quest.",muted,11f,true));health.addView(space(5));health.addView(action("SYNC TODAY'S STEPS",green){requestSteps()});addSection(health,10)
        addSection(action("CLAIM DAILY REWARD",green){if(store.canClaimDaily()){store.claimDaily();toast("Daily Quest complete");show("DAILY")}else toast("Daily Quest is not complete")},7)
        addSection(action("RECOVERY DAY",gold){store.recoveryDate=store.today();store.save();toast("Recovery Day registered")})
    }

    private fun format(v:Double)=if(v%1.0==0.0)v.toInt().toString() else String.format("%.1f",v)

    private fun renderGate(){
        if(battle.logs.isNotEmpty()&&!battle.finished){renderBattleScreen();return}
        addSection(systemTitle("GATE ACCESS","DUNGEON ENTRY"),4)
        val power=panelBox();power.addView(label("CURRENT POWER",muted,9f,true));power.addView(label(store.power.toString(),blue,32f,true));power.addView(label("Choose a Gate appropriate for your current combat strength.",muted,11f,true));addSection(power,12)
        gateButton("E-RANK GATE","RECOMMENDED 130   •   KEY ${store.eKeys}",green){if(store.eKeys>0){store.eKeys--;store.save();battle.start("E");renderBattleScreen()}else toast("No E-Rank key")}
        gateButton("D-RANK GATE","RECOMMENDED 230   •   KEY ${store.dKeys}",purple){if(store.dKeys>0){store.dKeys--;store.save();battle.start("D");renderBattleScreen()}else toast("No D-Rank key")}
        gateButton("C-RANK GATE","RECOMMENDED 380   •   KEY ${store.cKeys}",gold){if(store.cKeys>0){store.cKeys--;store.save();battle.start("C");renderBattleScreen()}else toast("No C-Rank key")}
        addSection(action("TRAINING INSTANCE",blue){battle.start("E");renderBattleScreen()})
    }

    private fun gateButton(name:String,sub:String,color:Int,start:()->Unit){val b=panelBox();b.addView(label(name,color,18f,true));b.addView(label(sub,muted,10f,true));b.addView(space(7));b.addView(action("ENTER",color,start));addSection(b,8)}

    private fun renderBattleScreen(){
        content.removeAllViews();updateTop();val s=battle.snapshot();addSection(systemTitle("${battle.gateRank}-RANK GATE","ROUND ${s.round}"),4)
        val enemy=panelBox();enemy.gravity=Gravity.CENTER
        enemy.addView(label("◇",red,if(compact)58f else 72f,true));enemy.addView(label(s.enemyName.uppercase(),Color.WHITE,20f,true));enemy.addView(label("ENEMY HP   ${s.enemyHp}/${s.enemyMaxHp}",muted,10f,true));enemy.addView(statBar(s.enemyHp,s.enemyMaxHp,red));enemy.addView(label("BREAK   ${s.enemyBreak}/${s.enemyBreakMax}",muted,10f,true));enemy.addView(statBar(s.enemyBreak,s.enemyBreakMax,purple));addSection(enemy,9)
        val intent=panelBox();intent.addView(label("ENEMY INTENT",gold,9f,true));intent.addView(label(s.intent.name.uppercase(),Color.WHITE,16f,true));intent.addView(label(if(s.analyzed)"${s.intent.minDamage}-${s.intent.maxDamage} DAMAGE   •   ${s.intent.tag}${if(s.intent.interruptBreak>0)"   •   INTERRUPT ${s.intent.interruptBreak} BREAK" else ""}" else "ANALYZE TO REVEAL DAMAGE AND INTERRUPT THRESHOLD",muted,10f,true));addSection(intent,9)
        val player=panelBox();player.addView(label("PLAYER   •   AP ${s.ap}/2",blue,13f,true));player.addView(label("HP ${s.playerHp}/${store.maxHp}    MP ${s.playerMp}/${store.maxMp}${if(s.bleedTurns>0)"    BLEED ${s.bleedTurns}" else ""}${if(s.broken)"    ENEMY BROKEN" else ""}",Color.WHITE,11f,true));addSection(player,9)
        if(s.finished){addSection(label(if(s.victory)"GATE CLEARED" else "DEFEAT",if(s.victory)green else red,28f,true));addSection(action("RETURN",green){show("GATE")});addBattleLog(s);return}
        val buttons=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL}
        fun row(a:View,b:View){val r=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};r.addView(a,LinearLayout.LayoutParams(0,50.dp,1f).apply{marginEnd=3.dp});r.addView(b,LinearLayout.LayoutParams(0,50.dp,1f).apply{marginStart=3.dp});buttons.addView(r,LinearLayout.LayoutParams(-1,-2).apply{setMargins(0,0,0,6.dp)})}
        row(action("ATTACK  •  1 AP",blue){timingDialog("STRIKE"){q->battle.attack(q);renderBattleScreen()}},action("GUARD  •  1 AP",gold){timingDialog("GUARD"){q->battle.guard(q);renderBattleScreen()}})
        row(action("ANALYZE  •  1 AP",Color.WHITE){toast(battle.analyze());renderBattleScreen()},action("DAGGER RUSH",purple){toast(battle.daggerRush());renderBattleScreen()})
        row(action("VITAL STRIKE",red){timingDialog("VITAL STRIKE"){q->toast(battle.vitalStrike(q));renderBattleScreen()}},action("END TURN",muted){battle.endTurn();renderBattleScreen()})
        row(action("HEAL POTION",green){toast(battle.potion("Healing Potion"));renderBattleScreen()},action("MANA POTION",blue){toast(battle.potion("Mana Potion"));renderBattleScreen()})
        addSection(buttons,8);addBattleLog(s)
    }

    private fun addBattleLog(s:BattleSnapshot){val log=panelBox();log.addView(label("COMBAT LOG",blue,10f,true));s.log.take(8).forEach{log.addView(label(it,muted,10f))};addSection(log)}

    private fun timingDialog(title:String,callback:(String)->Unit){
        val wrap=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(22.dp,16.dp,22.dp,4.dp);setBackgroundColor(bg)}
        wrap.addView(label("STOP THE MARKER NEAR THE CENTER\nPERFECT = GOLD   •   GOOD = BLUE",muted,10f,true))
        val progress=ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal).apply{max=100;progress=0;progressTintList=ColorStateList.valueOf(blue);progressBackgroundTintList=ColorStateList.valueOf(Color.argb(40,255,255,255));minimumHeight=12.dp};wrap.addView(progress,LinearLayout.LayoutParams(-1,12.dp).apply{setMargins(0,12.dp,0,8.dp)})
        val dialog=AlertDialog.Builder(this).setTitle("SYSTEM // $title").setView(wrap).setPositiveButton("EXECUTE",null).setNegativeButton("CANCEL",null).create()
        val handler=Handler(Looper.getMainLooper());var pos=0;var dir=1
        val tick=object:Runnable{override fun run(){if(!dialog.isShowing)return;pos+=dir*4;if(pos>=100){pos=100;dir=-1};if(pos<=0){pos=0;dir=1};progress.progress=pos;progress.progressTintList=ColorStateList.valueOf(if(pos in 46..54)gold else if(pos in 30..70)blue else red);handler.postDelayed(this,28)}}
        dialog.setOnShowListener{dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener{val q=if(pos in 46..54)"PERFECT" else if(pos in 30..70)"GOOD" else "MISS";handler.removeCallbacks(tick);dialog.dismiss();callback(q)};handler.post(tick)}
        dialog.setOnDismissListener{handler.removeCallbacks(tick)};dialog.show()
    }

    private fun renderShop(){
        addSection(systemTitle("SYSTEM SHOP","AUTHORIZED EXCHANGE"),4);addSection(label("${store.gold} GOLD",gold,22f,true),10)
        shopItem("HEALING POTION","Restore 45 HP in battle",35){store.consumables["Healing Potion"]=(store.consumables["Healing Potion"]?:0)+1}
        shopItem("MANA POTION","Restore 30 MP in battle",40){store.consumables["Mana Potion"]=(store.consumables["Mana Potion"]?:0)+1}
        shopItem("ABILITY POINT","Permanent stat point",250){store.abilityPoints++}
        shopItem("E-RANK GATE KEY","Opens an E-Rank Gate",180){store.eKeys++}
    }
    private fun shopItem(name:String,desc:String,price:Int,grant:()->Unit){val b=panelBox();b.addView(label(name,Color.WHITE,15f));b.addView(label(desc,muted,11f));b.addView(label("$price G",gold,11f));b.addView(space(5));b.addView(action("PURCHASE",gold){if(store.gold>=price){store.gold-=price;grant();store.save();show("SHOP")}else toast("Not enough Gold")});addSection(b,8)}

    private fun renderStatus(){
        addSection(systemTitle("STATUS","PLAYER ATTRIBUTES"),4)
        val p=panelBox();p.addView(label("LEVEL ${store.level}",Color.WHITE,28f,true));p.addView(label("${store.job.uppercase()}   •   ${store.title.uppercase()}\nPOWER ${store.power}   •   FATIGUE ${store.fatigue}%\nABILITY POINTS ${store.abilityPoints}",muted,11f,true));addSection(p,10)
        listOf("STR" to store.str,"VIT" to store.vit,"AGI" to store.agi,"INT" to store.intStat,"PER" to store.per).forEach{(stat,value)->
            val row=panelBox();row.orientation=LinearLayout.HORIZONTAL;row.gravity=Gravity.CENTER_VERTICAL;row.addView(label(stat,blue,14f),LinearLayout.LayoutParams(0,-2,1f));row.addView(label(value.toString(),Color.WHITE,20f,true),LinearLayout.LayoutParams(70.dp,-2));row.addView(action("+1",green){if(store.allocate(stat))show("STATUS")else toast("No Ability Points")},LinearLayout.LayoutParams(70.dp,44.dp));addSection(row,6)
        }
        addSection(action("SAVE SYSTEM DATA",blue){store.save();toast("Saved")},7);addSection(action("WIPE PLAYER DATA",red){AlertDialog.Builder(this).setTitle("Reset all progress?").setPositiveButton("RESET"){_,_->store.reset();recreate()}.setNegativeButton("CANCEL",null).show()})
    }

    private fun requestSteps(){val client=healthClient;if(client==null){toast("Health Connect unavailable");return};lifecycleScope.launch{try{val granted=client.permissionController.getGrantedPermissions();if(granted.contains(stepPermission))readSteps()else requestHealth.launch(setOf(stepPermission))}catch(_:Throwable){toast("Health Connect error")}}}
    private fun readSteps(){val client=healthClient?:return;lifecycleScope.launch{try{val zone=ZoneId.systemDefault();val start=LocalDate.now(zone).atStartOfDay(zone).toInstant();val r=client.aggregate(AggregateRequest(metrics=setOf(StepsRecord.COUNT_TOTAL),timeRangeFilter=TimeRangeFilter.between(start,Instant.now())));val steps=r[StepsRecord.COUNT_TOTAL]?:0L;store.ensureStepsTask(steps);toast("$steps steps synced");show("DAILY")}catch(_:Throwable){toast("Could not read steps")}}}

    private fun space(dp:Int)=Space(this).apply{layoutParams=LinearLayout.LayoutParams(1,dp.dp)}
    private fun toast(t:String)=Toast.makeText(this,t,Toast.LENGTH_SHORT).show()
    private val Int.dp:Int get()=(this*resources.displayMetrics.density).roundToInt()
}
