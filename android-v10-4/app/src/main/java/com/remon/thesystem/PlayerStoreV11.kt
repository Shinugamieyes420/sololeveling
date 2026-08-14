package com.remon.thesystem

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDate

data class V11Quest(
    val id: String,
    var name: String,
    var description: String,
    var xp: Int,
    var gold: Int,
    var minutes: Int,
    var category: String,
    var stat: String,
    var repeat: String = "daily",
    var doneDate: String = ""
)

data class V11DailyTask(
    val id: String,
    var name: String,
    var goal: Double,
    var progress: Double,
    var unit: String,
    var enabled: Boolean = true
)

class PlayerStoreV11(private val context: Context) {
    private val prefs = context.getSharedPreferences("system_player_v11", Context.MODE_PRIVATE)

    var schemaVersion = 11
    var awakeningSeen = false
    var playerName = "PLAYER"
    var level = 1
    var xp = 0
    var nextXp = 100
    var totalXp = 0
    var gold = 0
    var shadowEnergy = 0
    var eKeys = 1
    var dKeys = 0
    var cKeys = 0
    var abilityPoints = 0
    var fatigue = 0
    var hp = 156
    var mp = 88
    var str = 10
    var vit = 10
    var agi = 10
    var intStat = 10
    var per = 10
    var hunterRank = "E"
    var rankPoints = 0
    var jobChangeComplete = false
    var dailyMode = "normal"
    var dailyClaimedDate = ""
    var activeQuestId: String? = null

    val consumables = mutableMapOf("Healing Potion" to 2, "Mana Potion" to 1)
    val quests = mutableListOf<V11Quest>()
    val daily = mutableListOf<V11DailyTask>()

    init { loadOrMigrate() }

    val maxHp: Int get() = 96 + level * 10 + vit * 5
    val maxMp: Int get() = 42 + level * 6 + intStat * 4
    val power: Int get() = level * 7 + str * 3 + vit * 3 + agi * 3 + intStat * 3 + per * 3
    val job: String get() = if (jobChangeComplete) "Necromancer" else "None"
    val title: String get() = when {
        jobChangeComplete && level >= 30 -> "Shadow Commander"
        jobChangeComplete -> "The One Who Commands Shadows"
        level >= 10 -> "Dungeon Survivor"
        else -> "None"
    }
    val jobChangeAvailable: Boolean get() = level >= 15 && !jobChangeComplete
    val unlockedSkills: List<String> get() = buildList {
        add("Basic Attack"); add("Guard"); add("Analyze")
        if(level >= 4) add("Dagger Rush")
        if(level >= 8) add("Vital Strike")
        if(level >= 12) add("Sprint")
        if(jobChangeComplete) add("Shadow Extraction")
    }

    fun today() = LocalDate.now().toString()

    fun registerPlayer(name: String) {
        playerName = name.trim().ifBlank { "PLAYER" }.take(22)
        awakeningSeen = true
        save()
    }

    fun addXp(amount: Int) {
        val safe = amount.coerceAtLeast(0)
        xp += safe; totalXp += safe
        while (xp >= nextXp) {
            xp -= nextXp
            level++
            abilityPoints += 3
            nextXp = (nextXp * 1.20 + 40).toInt()
            hp = maxHp; mp = maxMp
        }
        save()
    }

    fun completeQuest(q: V11Quest) {
        if (q.doneDate == today()) return
        q.doneDate = today()
        gold += q.gold
        rankPoints += when {
            q.xp >= 70 -> 20
            q.xp >= 45 -> 12
            else -> 7
        }
        when {
            q.xp >= 70 -> cKeys++
            q.xp >= 45 -> dKeys++
            else -> eKeys++
        }
        when(q.stat){"str"->str++;"vit"->vit++;"agi"->agi++;"int"->intStat++;"per"->per++}
        activeQuestId = null
        updateHunterRank()
        addXp(q.xp)
    }

    fun completeGate(rank: String, xpReward: Int, goldReward: Int) {
        gold += goldReward
        shadowEnergy += when(rank){"C"->8;"D"->4;else->2}
        rankPoints += when(rank){"C"->45;"D"->25;else->12}
        updateHunterRank()
        addXp(xpReward)
    }

    fun completeJobChange() {
        jobChangeComplete = true
        shadowEnergy += 10
        save()
    }

    fun rankAllows(rank: String): Boolean {
        val order = listOf("E","D","C","B","A","S")
        return order.indexOf(hunterRank) >= order.indexOf(rank)
    }

    private fun updateHunterRank() {
        hunterRank = when {
            rankPoints >= 3600 -> "S"
            rankPoints >= 2200 -> "A"
            rankPoints >= 1200 -> "B"
            rankPoints >= 600 -> "C"
            rankPoints >= 220 -> "D"
            else -> "E"
        }
    }

    fun allocate(stat:String):Boolean{
        if(abilityPoints<=0)return false
        abilityPoints--
        when(stat){"STR"->str++;"VIT"->vit++;"AGI"->agi++;"INT"->intStat++;"PER"->per++}
        hp = hp.coerceAtMost(maxHp); mp = mp.coerceAtMost(maxMp)
        save(); return true
    }

    fun setDailyPreset(mode:String){
        dailyMode=mode;daily.clear()
        val src=when(mode){
            "low"->listOf(V11DailyTask("water","Water drinken",1.0,0.0,"task"),V11DailyTask("tidy","5 minuten opruimen",5.0,0.0,"min"),V11DailyTask("walk","Korte wandeling",0.3,0.0,"km"))
            "high"->listOf(V11DailyTask("tidy","20 minuten huishouden",20.0,0.0,"min"),V11DailyTask("walk","Wandeling",3.0,0.0,"km"),V11DailyTask("squat","Squats",25.0,0.0,"reps"),V11DailyTask("focus","Focus training",20.0,0.0,"min"))
            else->listOf(V11DailyTask("tidy","10 minuten opruimen",10.0,0.0,"min"),V11DailyTask("walk","Wandeling",1.0,0.0,"km"),V11DailyTask("squat","Squats",10.0,0.0,"reps"),V11DailyTask("important","Belangrijke taak",1.0,0.0,"task"))
        }
        daily.addAll(src);save()
    }

    fun ensureStepsTask(steps:Long){
        val found=daily.firstOrNull{it.unit=="steps"}
        if(found!=null)found.progress=steps.toDouble() else daily.add(V11DailyTask("steps","Stappen",when(dailyMode){"low"->2500.0;"high"->8000.0;else->5000.0},steps.toDouble(),"steps"))
        save()
    }

    fun canClaimDaily()=daily.filter{it.enabled}.all{it.progress>=it.goal}&&dailyClaimedDate!=today()
    fun claimDaily(){
        if(!canClaimDaily())return
        val reward=35+daily.filter{it.enabled}.sumOf{t->when(t.unit){"steps"->(t.goal/300).toInt();"km"->(t.goal*14).toInt();"min"->(t.goal*1.5).toInt();"reps"->(t.goal*.7).toInt();else->8}}
        dailyClaimedDate=today();gold+=reward;dKeys++;fatigue=(fatigue-5).coerceAtLeast(0);rankPoints+=8;updateHunterRank();addXp(reward)
    }

    fun save(){
        val o=JSONObject()
        o.put("schemaVersion",schemaVersion).put("awakeningSeen",awakeningSeen).put("playerName",playerName)
            .put("level",level).put("xp",xp).put("nextXp",nextXp).put("totalXp",totalXp).put("gold",gold).put("shadowEnergy",shadowEnergy)
            .put("eKeys",eKeys).put("dKeys",dKeys).put("cKeys",cKeys).put("abilityPoints",abilityPoints).put("fatigue",fatigue).put("hp",hp).put("mp",mp)
            .put("str",str).put("vit",vit).put("agi",agi).put("int",intStat).put("per",per).put("hunterRank",hunterRank).put("rankPoints",rankPoints)
            .put("jobChangeComplete",jobChangeComplete).put("dailyMode",dailyMode).put("dailyClaimedDate",dailyClaimedDate).put("activeQuestId",activeQuestId?:JSONObject.NULL)
        o.put("quests",JSONArray().also{a->quests.forEach{q->a.put(JSONObject().apply{put("id",q.id);put("name",q.name);put("description",q.description);put("xp",q.xp);put("gold",q.gold);put("minutes",q.minutes);put("category",q.category);put("stat",q.stat);put("repeat",q.repeat);put("doneDate",q.doneDate)})}})
        o.put("daily",JSONArray().also{a->daily.forEach{t->a.put(JSONObject().apply{put("id",t.id);put("name",t.name);put("goal",t.goal);put("progress",t.progress);put("unit",t.unit);put("enabled",t.enabled)})}})
        o.put("consumables",JSONObject(consumables as Map<*,*>))
        prefs.edit().putString("state",o.toString()).apply()
    }

    private fun loadOrMigrate(){
        val raw=prefs.getString("state",null)
        if(raw!=null){loadJson(JSONObject(raw));return}
        val legacy=context.getSharedPreferences("system_native_v104",Context.MODE_PRIVATE).getString("state",null)
        if(legacy!=null){
            try{val l=JSONObject(legacy);level=l.optInt("level",1);xp=l.optInt("xp",0);nextXp=l.optInt("nextXp",100);gold=l.optInt("gold",0);shadowEnergy=l.optInt("shadowEnergy",0);eKeys=l.optInt("eKeys",1);dKeys=l.optInt("dKeys",0);cKeys=l.optInt("cKeys",0);abilityPoints=l.optInt("abilityPoints",0);fatigue=l.optInt("fatigue",0);str=l.optInt("str",10);vit=l.optInt("vit",10);agi=l.optInt("agi",10);intStat=l.optInt("int",10);per=l.optInt("per",10)}catch(_:Throwable){}
        }
        quests.addAll(defaultQuests());setDailyPreset("normal");hp=maxHp;mp=maxMp;save()
    }

    private fun loadJson(o:JSONObject){
        schemaVersion=o.optInt("schemaVersion",11);awakeningSeen=o.optBoolean("awakeningSeen",false);playerName=o.optString("playerName","PLAYER")
        level=o.optInt("level",1);xp=o.optInt("xp",0);nextXp=o.optInt("nextXp",100);totalXp=o.optInt("totalXp",xp);gold=o.optInt("gold",0);shadowEnergy=o.optInt("shadowEnergy",0)
        eKeys=o.optInt("eKeys",1);dKeys=o.optInt("dKeys",0);cKeys=o.optInt("cKeys",0);abilityPoints=o.optInt("abilityPoints",0);fatigue=o.optInt("fatigue",0)
        str=o.optInt("str",10);vit=o.optInt("vit",10);agi=o.optInt("agi",10);intStat=o.optInt("int",10);per=o.optInt("per",10);hunterRank=o.optString("hunterRank","E");rankPoints=o.optInt("rankPoints",0);jobChangeComplete=o.optBoolean("jobChangeComplete",false)
        dailyMode=o.optString("dailyMode","normal");dailyClaimedDate=o.optString("dailyClaimedDate","");activeQuestId=if(o.isNull("activeQuestId"))null else o.optString("activeQuestId")
        quests.clear();val qa=o.optJSONArray("quests")?:JSONArray();for(i in 0 until qa.length()){val q=qa.getJSONObject(i);quests.add(V11Quest(q.getString("id"),q.getString("name"),q.optString("description"),q.optInt("xp",35),q.optInt("gold",55),q.optInt("minutes",30),q.optString("category","custom"),q.optString("stat","vit"),q.optString("repeat","daily"),q.optString("doneDate","")))}
        daily.clear();val da=o.optJSONArray("daily")?:JSONArray();for(i in 0 until da.length()){val t=da.getJSONObject(i);daily.add(V11DailyTask(t.getString("id"),t.getString("name"),t.optDouble("goal",1.0),t.optDouble("progress",0.0),t.optString("unit","task"),t.optBoolean("enabled",true)))}
        val co=o.optJSONObject("consumables");if(co!=null){consumables.keys.toList().forEach{k->consumables[k]=co.optInt(k,consumables[k]?:0)}}
        if(quests.isEmpty())quests.addAll(defaultQuests());if(daily.isEmpty())setDailyPreset(dailyMode);hp=o.optInt("hp",maxHp).coerceIn(1,maxHp);mp=o.optInt("mp",maxMp).coerceIn(0,maxMp);updateHunterRank()
    }

    private fun defaultQuests()=listOf(
        V11Quest("catbox","Kattenbak Raid","Kattenbak schoonmaken en omgeving resetten.",25,40,15,"household","vit"),
        V11Quest("sweep","Dungeon Sweep","Reset één deel van het huis.",35,60,30,"household","vit"),
        V11Quest("work","Work Prep","Kleding, tas, sleutels en OV klaarzetten.",25,40,15,"admin","int"),
        V11Quest("walk","Shadow Walk","Realistische wandeling buiten.",35,55,30,"movement","agi"),
        V11Quest("focus","Focus Gate","Telefoon weg en één nuttige taak afmaken.",45,75,35,"admin","per"),
        V11Quest("kitchen","Kitchen Reset","Maak de keuken weer bruikbaar.",65,105,50,"household","vit","weekly"),
        V11Quest("training","Training Arc","Realistische fysieke training.",50,85,30,"training","str","weekly")
    )
}
