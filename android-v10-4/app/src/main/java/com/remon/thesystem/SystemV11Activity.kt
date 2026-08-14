package com.remon.thesystem

import android.app.AlertDialog
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.graphics.Typeface
import android.net.Uri
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
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import kotlin.math.max
import kotlin.math.roundToInt

class SystemV11Activity : ComponentActivity() {
    private lateinit var store: PlayerStoreV11
    private lateinit var battle: BattleEngineV11
    private lateinit var root: LinearLayout
    private lateinit var content: LinearLayout
    private lateinit var header: TextView
    private var screen = "HUD"
    private var healthClient: HealthConnectClient? = null
    private val stepPermission = HealthPermission.getReadPermission(StepsRecord::class)

    private val bg=Color.rgb(1,4,9); private val blue=Color.rgb(128,234,255); private val green=Color.rgb(72,255,173)
    private val muted=Color.rgb(132,158,177); private val red=Color.rgb(255,93,134); private val gold=Color.rgb(255,215,123); private val purple=Color.rgb(197,166,255)
    private val widthDp:Float get()=resources.displayMetrics.widthPixels/resources.displayMetrics.density
    private val compact:Boolean get()=widthDp<380f
    private fun sp(v:Float)=v*(widthDp/412f).coerceIn(.87f,1.13f)
    private val Int.dp:Int get()=(this*resources.displayMetrics.density).roundToInt()

    private val requestHealth=registerForActivityResult(PermissionController.createRequestPermissionResultContract()){granted->if(granted.contains(stepPermission))readSteps() else toast("Steps permission not granted")}

    override fun onCreate(savedInstanceState:Bundle?){
        super.onCreate(savedInstanceState);window.statusBarColor=bg;window.navigationBarColor=bg
        store=PlayerStoreV11(this);battle=BattleEngineV11(store)
        if(HealthConnectClient.getSdkStatus(this)==HealthConnectClient.SDK_AVAILABLE)healthClient=HealthConnectClient.getOrCreate(this)
        buildShell();show("HUD")
        if(!store.awakeningSeen)Handler(Looper.getMainLooper()).postDelayed({showAwakening()},250)
        onBackPressedDispatcher.addCallback(this,object:OnBackPressedCallback(true){override fun handleOnBackPressed(){if(screen!="HUD")show("HUD") else finish()}})
    }

    private fun buildShell(){
        root=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setBackgroundColor(bg);setOnApplyWindowInsetsListener{v,i->val b=i.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout());v.setPadding(0,b.top,0,b.bottom);i}}
        val top=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL;gravity=Gravity.CENTER_VERTICAL;setPadding(if(compact)10.dp else 14.dp,8.dp,if(compact)10.dp else 14.dp,8.dp)}
        header=TextView(this).apply{setTextColor(blue);textSize=sp(10f);typeface=Typeface.DEFAULT_BOLD;letterSpacing=.10f}
        top.addView(header,LinearLayout.LayoutParams(0,46.dp,1f))
        top.addView(action("SYSTEM MENU",blue){openMenu()},LinearLayout.LayoutParams(if(compact)118.dp else 142.dp,46.dp))
        root.addView(top);root.addView(View(this).apply{setBackgroundColor(Color.argb(80,128,234,255))},LinearLayout.LayoutParams(-1,1.dp))
        val scroll=ScrollView(this).apply{isFillViewport=true;overScrollMode=View.OVER_SCROLL_NEVER}
        content=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(if(compact)10.dp else 14.dp,14.dp,if(compact)10.dp else 14.dp,22.dp)}
        scroll.addView(content,ViewGroup.LayoutParams(-1,-2));root.addView(scroll,LinearLayout.LayoutParams(-1,0,1f));setContentView(root)
    }

    private fun show(name:String){screen=name;content.removeAllViews();updateHeader();when(name){"HUD"->renderHud();"QUEST"->renderQuests();"DAILY"->renderDaily();"GATE"->renderGate();"SHOP"->renderShop();"STATUS"->renderStatus();"UPDATE"->renderUpdate()}}
    private fun updateHeader(){header.text="THE SYSTEM  •  ${store.playerName.uppercase()}  •  LV.${store.level}  •  RANK ${store.hunterRank}"}

    private fun openMenu(){
        val box=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(14.dp,10.dp,14.dp,10.dp);setBackgroundColor(bg)}
        val dialog=AlertDialog.Builder(this).setTitle("SYSTEM MENU").setView(box).create()
        listOf("HUD" to "STATUS","QUEST" to "QUEST INFO","DAILY" to "DAILY QUEST","GATE" to "GATE ACCESS","SHOP" to "SYSTEM SHOP","STATUS" to "PLAYER STATS","UPDATE" to "SYSTEM UPDATE").forEach{(id,label)->box.addView(action(label,if(id==screen)green else blue){dialog.dismiss();show(id)},LinearLayout.LayoutParams(-1,48.dp).apply{setMargins(0,3.dp,0,3.dp)})}
        dialog.show()
    }

    private fun showAwakening(){
        val wrap=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;gravity=Gravity.CENTER;setPadding(20.dp,8.dp,20.dp,0);setBackgroundColor(bg)}
        wrap.addView(text("SYSTEM DETECTED",blue,13f,true));wrap.addView(text("PLAYER REGISTRATION",Color.WHITE,24f,true));wrap.addView(text("A new Player has been recognized. Register a name to initialize the System.",muted,12f,true))
        val input=EditText(this).apply{hint="PLAYER NAME";setHintTextColor(muted);setTextColor(Color.WHITE);gravity=Gravity.CENTER;setBackgroundResource(R.drawable.system_input);setPadding(8.dp,8.dp,8.dp,8.dp)};wrap.addView(input,LinearLayout.LayoutParams(-1,52.dp).apply{setMargins(0,12.dp,0,0)})
        val d=AlertDialog.Builder(this).setView(wrap).setCancelable(false).setPositiveButton("REGISTER",null).create();d.setOnShowListener{d.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener{store.registerPlayer(input.text.toString());d.dismiss();show("HUD");toast("PLAYER REGISTRATION COMPLETE")}};d.show()
    }

    private fun systemTitle(main:String,sub:String):View=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;gravity=Gravity.CENTER;setPadding(3.dp,8.dp,3.dp,14.dp);addView(text(main,Color.WHITE,if(compact)20f else 24f,true).apply{typeface=Typeface.DEFAULT_BOLD;letterSpacing=.14f});addView(text(sub,muted,9f,true))}
    private fun panel()=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(if(compact)12.dp else 16.dp,14.dp,if(compact)12.dp else 16.dp,14.dp);setBackgroundResource(R.drawable.system_panel)}
    private fun text(t:String,c:Int=Color.WHITE,s:Float=14f,center:Boolean=false)=TextView(this).apply{text=t;setTextColor(c);textSize=sp(s);gravity=if(center)Gravity.CENTER else Gravity.START;setLineSpacing(2f,1f);setPadding(3.dp,4.dp,3.dp,4.dp)}
    private fun action(t:String,c:Int=blue,click:()->Unit)=TextView(this).apply{text=t;setTextColor(c);textSize=sp(11f);gravity=Gravity.CENTER;typeface=Typeface.DEFAULT_BOLD;letterSpacing=.06f;setBackgroundResource(R.drawable.system_button);isClickable=true;isFocusable=true;setPadding(8.dp,8.dp,8.dp,8.dp);setOnClickListener{click()}}
    private fun add(v:View,gap:Int=9){content.addView(v,LinearLayout.LayoutParams(-1,-2).apply{setMargins(0,0,0,gap.dp)})}
    private fun space(h:Int)=Space(this).apply{layoutParams=LinearLayout.LayoutParams(1,h.dp)}
    private fun bar(v:Int,m:Int,c:Int)=ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal).apply{max=max(1,m);progress=v.coerceIn(0,max);progressTintList=ColorStateList.valueOf(c);progressBackgroundTintList=ColorStateList.valueOf(Color.argb(35,255,255,255));minimumHeight=6.dp}

    private fun renderHud(){
        add(systemTitle("STATUS","PLAYER INFORMATION"),3)
        val p=panel();p.addView(text(store.level.toString(),Color.WHITE,if(compact)58f else 72f,true).apply{typeface=Typeface.DEFAULT_BOLD});p.addView(text("LEVEL",blue,10f,true));p.addView(space(7))
        p.addView(text("HUNTER RANK     ${store.hunterRank}\nJOB                     ${store.job}\nTITLE                   ${store.title}\nPOWER                 ${store.power}",muted,13f,true));p.addView(space(10))
        p.addView(text("HP   ${store.hp} / ${store.maxHp}",Color.WHITE,10f));p.addView(bar(store.hp,store.maxHp,green));p.addView(text("MP   ${store.mp} / ${store.maxMp}",Color.WHITE,10f));p.addView(bar(store.mp,store.maxMp,blue));p.addView(text("XP   ${store.xp} / ${store.nextXp}",Color.WHITE,10f));p.addView(bar(store.xp,store.nextXp,purple));p.addView(text("FATIGUE ${store.fatigue}%   •   AP ${store.abilityPoints}",muted,10f,true));add(p,14)
        if(store.jobChangeAvailable){val n=panel();n.addView(text("SYSTEM NOTIFICATION",gold,10f,true));n.addView(text("JOB CHANGE QUEST AVAILABLE",Color.WHITE,18f,true));n.addView(text("A special dungeon has appeared. Clear it to unlock your hidden class.",muted,11f,true));n.addView(space(6));n.addView(action("OPEN JOB CHANGE DUNGEON",gold){show("GATE")});add(n,14)}
        val active=store.quests.firstOrNull{it.id==store.activeQuestId};val q=panel();q.addView(text(if(active==null)"NO QUEST ACTIVE" else "CURRENT QUEST",blue,10f,true));q.addView(text(active?.name?.uppercase()?:"SYSTEM STANDBY",Color.WHITE,20f,true));q.addView(text(active?.description?:"Real-life quests are the main source of XP and Gate Keys.",muted,11f,true));if(active!=null){q.addView(space(6));q.addView(action("CLAIM REWARD",green){store.completeQuest(active);toast("+${active.xp} XP  +${active.gold} Gold");show("HUD")})};add(q,14)
        add(systemTitle("AVAILABLE QUESTS","REAL-LIFE DIRECTIVES"),3);store.quests.filter{it.doneDate!=store.today()}.take(4).forEach{add(questCard(it),7)}
    }

    private fun questCard(q:V11Quest):View{val p=panel();val r=when{q.xp>=70->"A";q.xp>=50->"B";q.xp>=35->"C";q.xp>=25->"D";else->"E"};p.addView(text("[$r-RANK]  ${q.name.uppercase()}",Color.WHITE,14f));p.addView(text(q.description,muted,11f));p.addView(text("${q.minutes} MIN   •   +${q.xp} XP   •   +${q.gold} G",blue,9f));p.addView(space(5));p.addView(action(if(store.activeQuestId==q.id)"ACTIVE" else "ACCEPT QUEST",if(store.activeQuestId==q.id)green else blue){store.activeQuestId=q.id;store.save();show("HUD")});return p}
    private fun renderQuests(){add(systemTitle("QUEST INFO","SYSTEM DIRECTIVES"),3);store.quests.forEach{add(questCard(it),7)}}

    private fun renderDaily(){
        add(systemTitle("DAILY QUEST","STRENGTHEN THE PLAYER"),3)
        val modes=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};listOf("low","normal","high").forEach{m->modes.addView(action(m.uppercase(),if(store.dailyMode==m)green else muted){store.setDailyPreset(m);show("DAILY")},LinearLayout.LayoutParams(0,44.dp,1f).apply{setMargins(2.dp,0,2.dp,0)})};add(modes,10)
        store.daily.forEach{t->val p=panel();p.addView(text(t.name.uppercase(),Color.WHITE,13f));val row=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL;gravity=Gravity.CENTER_VERTICAL};val input=EditText(this).apply{setText(if(t.progress%1.0==0.0)t.progress.toInt().toString() else String.format("%.1f",t.progress));setTextColor(Color.WHITE);gravity=Gravity.CENTER;inputType=InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL;setBackgroundResource(R.drawable.system_input);setSelectAllOnFocus(true)};row.addView(input,LinearLayout.LayoutParams(0,44.dp,1f));row.addView(text(" / ${if(t.goal%1.0==0.0)t.goal.toInt() else t.goal} ${t.unit.uppercase()}",muted,10f,true),LinearLayout.LayoutParams(0,44.dp,1f));row.addView(action("SET",green){t.progress=input.text.toString().toDoubleOrNull()?:t.progress;store.save();show("DAILY")},LinearLayout.LayoutParams(74.dp,44.dp));p.addView(row);add(p,7)}
        val h=panel();h.addView(text("HEALTH CONNECT",blue,12f,true));h.addView(text("Sync today's steps from Samsung Health / Health Connect.",muted,11f,true));h.addView(space(5));h.addView(action("SYNC STEPS",green){requestSteps()});add(h,9)
        add(action("CLAIM DAILY REWARD",green){if(store.canClaimDaily()){store.claimDaily();toast("DAILY QUEST COMPLETE");show("DAILY")}else toast("Daily Quest incomplete")})
    }

    private fun renderGate(){
        if(battle.logs.isNotEmpty()&&!battle.finished){renderBattle();return}
        add(systemTitle("GATE ACCESS","DUNGEON ENTRY"),3);val info=panel();info.addView(text("HUNTER RANK ${store.hunterRank}",blue,14f,true));info.addView(text("POWER ${store.power}",Color.WHITE,28f,true));info.addView(text("Higher Gates require both sufficient Hunter Rank and a Gate Key.",muted,11f,true));add(info,12)
        if(store.jobChangeAvailable)gateCard("JOB CHANGE DUNGEON","SPECIAL","Hidden class evaluation. One boss. Failure does not remove a Gate Key.",gold,true){battle.start("JOB");renderBattle()}
        gateCard("E-RANK GATE","KEYS ${store.eKeys}","Two rooms. Intended for new Hunters.",green,store.eKeys>0){store.eKeys--;store.save();battle.start("E");renderBattle()}
        gateCard("D-RANK GATE","KEYS ${store.dKeys}","Three rooms. Requires D-Rank Hunter status.",purple,store.dKeys>0&&store.rankAllows("D")){store.dKeys--;store.save();battle.start("D");renderBattle()}
        gateCard("C-RANK GATE","KEYS ${store.cKeys}","Boss dungeon. Requires C-Rank Hunter status.",gold,store.cKeys>0&&store.rankAllows("C")){store.cKeys--;store.save();battle.start("C");renderBattle()}
    }
    private fun gateCard(name:String,sub:String,desc:String,color:Int,enabled:Boolean,go:()->Unit){val p=panel();p.addView(text(name,color,17f,true));p.addView(text(sub,muted,9f,true));p.addView(text(desc,muted,11f,true));p.addView(space(6));p.addView(action(if(enabled)"ENTER" else "LOCKED",if(enabled)color else muted){if(enabled)go() else toast("Gate requirements not met")});add(p,8)}

    private fun renderBattle(){
        content.removeAllViews();updateHeader();val s=battle.state();add(systemTitle("${battle.gateRank}-RANK BATTLE","ROUND ${s.round}   •   AP ${s.ap}/2"),3)
        val e=panel();e.addView(text(s.enemy,red,21f,true));e.addView(text("HP ${s.hp} / ${s.maxHp}",Color.WHITE,10f));e.addView(bar(s.hp,s.maxHp,red));e.addView(text("BREAK ${s.breakNow} / ${s.breakMax}",Color.WHITE,10f));e.addView(bar(s.breakNow,s.breakMax,purple));add(e,9)
        val i=panel();i.addView(text("ENEMY INTENT",gold,9f,true));i.addView(text(s.intent.name,Color.WHITE,17f,true));i.addView(text(if(s.analyzed)"${s.intent.min}-${s.intent.max} DAMAGE${if(s.intent.interrupt>0)"   •   INTERRUPT ${s.intent.interrupt} BREAK" else ""}" else "Use ANALYZE to reveal exact threat data.",muted,10f,true));add(i,9)
        val p=panel();p.addView(text("PLAYER",blue,9f,true));p.addView(text("HP ${s.playerHp}/${store.maxHp}   •   MP ${s.playerMp}/${store.maxMp}   •   AP ${s.ap}/2",Color.WHITE,12f,true));add(p,9)
        if(s.finished){add(text(if(s.victory)"GATE CLEARED" else "DEFEAT",if(s.victory)green else red,27f,true),10);add(action("RETURN",green){battle.logs.clear();show("GATE")});battleLog(s);return}
        val r1=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};r1.addView(action("ATTACK • 1 AP",blue){timing("ATTACK"){battle.attack(it);renderBattle()}},LinearLayout.LayoutParams(0,50.dp,1f).apply{marginEnd=3.dp});r1.addView(action("GUARD • 1 AP",gold){timing("GUARD"){battle.guard(it);renderBattle()}},LinearLayout.LayoutParams(0,50.dp,1f).apply{marginStart=3.dp});add(r1,6)
        val r2=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};r2.addView(action("ANALYZE • 1 AP",Color.WHITE){toast(battle.analyze());renderBattle()},LinearLayout.LayoutParams(0,50.dp,1f).apply{marginEnd=3.dp});r2.addView(action("DAGGER RUSH",purple){toast(battle.daggerRush());renderBattle()},LinearLayout.LayoutParams(0,50.dp,1f).apply{marginStart=3.dp});add(r2,6)
        val r3=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};r3.addView(action("VITAL STRIKE",red){timing("VITAL STRIKE"){toast(battle.vitalStrike(it));renderBattle()}},LinearLayout.LayoutParams(0,50.dp,1f).apply{marginEnd=3.dp});r3.addView(action("END TURN",muted){battle.endTurn();renderBattle()},LinearLayout.LayoutParams(0,50.dp,1f).apply{marginStart=3.dp});add(r3,6)
        val r4=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL};r4.addView(action("HEAL ×${store.consumables["Healing Potion"]?:0}",green){toast(battle.potion("Healing Potion"));renderBattle()},LinearLayout.LayoutParams(0,48.dp,1f).apply{marginEnd=3.dp});r4.addView(action("MANA ×${store.consumables["Mana Potion"]?:0}",blue){toast(battle.potion("Mana Potion"));renderBattle()},LinearLayout.LayoutParams(0,48.dp,1f).apply{marginStart=3.dp});add(r4,9);battleLog(s)
    }
    private fun battleLog(s:V11BattleState){val l=panel();l.addView(text("COMBAT LOG",blue,10f,true));s.log.take(10).forEach{l.addView(text(it,muted,10f))};add(l)}
    private fun timing(title:String,cb:(String)->Unit){val wrap=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;setPadding(20.dp,10.dp,20.dp,2.dp)};wrap.addView(text("Tap near the center. PERFECT gives the strongest result.",muted,11f,true));val prog=ProgressBar(this,null,android.R.attr.progressBarStyleHorizontal).apply{max=100;progress=0;progressTintList=ColorStateList.valueOf(blue)};wrap.addView(prog,LinearLayout.LayoutParams(-1,28.dp));val d=AlertDialog.Builder(this).setTitle(title).setView(wrap).setPositiveButton("ACT",null).setNegativeButton("CANCEL",null).create();val h=Handler(Looper.getMainLooper());var pos=0;var dir=1;val tick=object:Runnable{override fun run(){if(!d.isShowing)return;pos+=dir*4;if(pos>=100){pos=100;dir=-1};if(pos<=0){pos=0;dir=1};prog.progress=pos;h.postDelayed(this,27)}};d.setOnShowListener{d.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener{val q=if(pos in 46..54)"PERFECT" else if(pos in 30..70)"GOOD" else "MISS";h.removeCallbacks(tick);d.dismiss();cb(q)};h.post(tick)};d.setOnDismissListener{h.removeCallbacks(tick)};d.show()}

    private fun renderShop(){add(systemTitle("SYSTEM SHOP","AUTHORIZED PURCHASES"),3);add(text("GOLD  ${store.gold}",gold,20f,true),8);shopItem("Healing Potion","Restore 45 HP in battle",35){store.consumables["Healing Potion"]=(store.consumables["Healing Potion"]?:0)+1};shopItem("Mana Potion","Restore 30 MP in battle",40){store.consumables["Mana Potion"]=(store.consumables["Mana Potion"]?:0)+1};shopItem("E-Rank Gate Key","Additional E-Rank dungeon entry",180){store.eKeys++}}
    private fun shopItem(name:String,desc:String,price:Int,grant:()->Unit){val p=panel();p.addView(text(name,Color.WHITE,15f));p.addView(text(desc,muted,10f));p.addView(action("BUY  •  $price G",gold){if(store.gold>=price){store.gold-=price;grant();store.save();show("SHOP")}else toast("Not enough Gold")});add(p,7)}

    private fun renderStatus(){add(systemTitle("PLAYER STATUS","ABILITY DISTRIBUTION"),3);val p=panel();p.addView(text("HUNTER RANK ${store.hunterRank}   •   RANK PTS ${store.rankPoints}\nJOB ${store.job}   •   POWER ${store.power}\nUNLOCKED SKILLS\n${store.unlockedSkills.joinToString("  •  ")}",muted,12f,true));add(p,10);listOf("STR" to store.str,"VIT" to store.vit,"AGI" to store.agi,"INT" to store.intStat,"PER" to store.per).forEach{(k,v)->add(action("$k   $v   [+1]",green){if(store.allocate(k))show("STATUS")else toast("No Ability Points")},6)}}

    private fun renderUpdate(){add(systemTitle("SYSTEM UPDATE","STABLE UPDATE CHANNEL"),3);val p=panel();p.addView(text("INSTALLED VERSION",muted,9f,true));p.addView(text("v${BuildConfig.VERSION_NAME}",Color.WHITE,24f,true));p.addView(text("Future v11.x APKs use the same package identity and signing key, so they can install over this version while keeping this app's save data.",muted,11f,true));p.addView(space(8));p.addView(action("CHECK FOR UPDATE",green){checkUpdate()});add(p)}

    private fun checkUpdate(){toast("Checking update channel…");Thread{try{val u=URL("https://raw.githubusercontent.com/Shinugamieyes420/sololeveling/android-v11-stable/android-update/latest.json");val c=(u.openConnection() as HttpURLConnection).apply{connectTimeout=7000;readTimeout=7000};val o=JSONObject(c.inputStream.bufferedReader().use{it.readText()});val code=o.optInt("versionCode",0);val version=o.optString("versionName","");val download=o.optString("downloadUrl","");runOnUiThread{if(code>BuildConfig.VERSION_CODE)AlertDialog.Builder(this).setTitle("UPDATE AVAILABLE").setMessage("Version $version is available.").setPositiveButton("DOWNLOAD"){_,_->startActivity(Intent(Intent.ACTION_VIEW,Uri.parse(download)))}.setNegativeButton("LATER",null).show() else toast("The System is up to date")}}catch(_:Throwable){runOnUiThread{toast("Update check unavailable")}}}.start()}

    private fun requestSteps(){val client=healthClient;if(client==null){toast("Health Connect unavailable");return};lifecycleScope.launch{try{val g=client.permissionController.getGrantedPermissions();if(g.contains(stepPermission))readSteps() else requestHealth.launch(setOf(stepPermission))}catch(_:Throwable){toast("Health Connect error")}}}
    private fun readSteps(){val client=healthClient?:return;lifecycleScope.launch{try{val zone=ZoneId.systemDefault();val start=LocalDate.now(zone).atStartOfDay(zone).toInstant();val r=client.aggregate(AggregateRequest(metrics=setOf(StepsRecord.COUNT_TOTAL),timeRangeFilter=TimeRangeFilter.between(start,Instant.now())));val steps=r[StepsRecord.COUNT_TOTAL]?:0L;store.ensureStepsTask(steps);toast("$steps steps synced");show("DAILY")}catch(_:Throwable){toast("Could not read steps")}}}
    private fun toast(t:String)=Toast.makeText(this,t,Toast.LENGTH_SHORT).show()
}
