package com.remon.thesystem

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.time.LocalDate

data class Quest(
    val id: String,
    var name: String,
    var description: String,
    var xp: Int,
    var gold: Int,
    var minutes: Int,
    var category: String,
    var stat: String,
    var repeat: String = "daily",
    var doneDate: String = "",
    var refusedDate: String = "",
    var postponedUntil: String = ""
)

data class DailyTask(
    val id: String,
    var name: String,
    var goal: Double,
    var progress: Double,
    var unit: String,
    var enabled: Boolean = true
)

class GameStore(private val context: Context) {
    private val prefs = context.getSharedPreferences("system_native_v104", Context.MODE_PRIVATE)

    var level = 1
    var xp = 0
    var nextXp = 100
    var gold = 150
    var shadowEnergy = 0
    var eKeys = 2
    var dKeys = 0
    var cKeys = 0
    var abilityPoints = 0
    var fatigue = 0
    var hp = 168
    var mp = 102
    var str = 12
    var vit = 11
    var agi = 10
    var intStat = 10
    var per = 11
    var dailyMode = "normal"
    var dailyClaimedDate = ""
    var recoveryDate = ""
    var activeQuestId: String? = null
    var activeQuestStartedAt = 0L

    val consumables = mutableMapOf("Healing Potion" to 3, "Mana Potion" to 1)
    val quests = mutableListOf<Quest>()
    val daily = mutableListOf<DailyTask>()

    init { load() }

    val job: String get() = when {
        level >= 50 -> "Shadow Monarch"
        level >= 25 -> "Necromancer"
        level >= 10 -> "Assassin"
        else -> "None"
    }
    val title: String get() = when {
        level >= 50 -> "Monarch Candidate"
        level >= 25 -> "Shadow Commander"
        level >= 10 -> "Dungeon Survivor"
        else -> "None"
    }
    val maxHp: Int get() = 100 + level * 12 + vit * 4
    val maxMp: Int get() = 50 + level * 8 + intStat * 3
    val power: Int get() = level * 8 + (str + vit + agi + intStat + per) * 2

    fun today() = LocalDate.now().toString()

    fun addXp(amount: Int) {
        xp += amount
        while (xp >= nextXp) {
            xp -= nextXp
            level++
            abilityPoints += 3
            nextXp = (nextXp * 1.22 + 45).toInt()
            hp = maxHp
            mp = maxMp
        }
        save()
    }

    fun completeQuest(q: Quest) {
        q.doneDate = today()
        gold += q.gold
        when {
            q.xp >= 70 -> cKeys++
            q.xp >= 45 -> dKeys++
            else -> eKeys++
        }
        when (q.stat) {
            "str" -> str++
            "vit" -> vit++
            "agi" -> agi++
            "int" -> intStat++
            "per" -> per++
        }
        activeQuestId = null
        addXp(q.xp)
    }

    fun setDailyPreset(mode: String) {
        dailyMode = mode
        daily.clear()
        val tasks = when (mode) {
            "low" -> listOf(
                DailyTask("water", "Water drinken", 1.0, 0.0, "task"),
                DailyTask("tidy", "5 minuten opruimen", 5.0, 0.0, "min"),
                DailyTask("walk", "Korte wandeling", 0.3, 0.0, "km")
            )
            "high" -> listOf(
                DailyTask("tidy", "20 minuten huishouden", 20.0, 0.0, "min"),
                DailyTask("walk", "Wandeling", 3.0, 0.0, "km"),
                DailyTask("squat", "Squats", 25.0, 0.0, "reps"),
                DailyTask("focus", "Focus training", 20.0, 0.0, "min")
            )
            else -> listOf(
                DailyTask("tidy", "10 minuten opruimen", 10.0, 0.0, "min"),
                DailyTask("walk", "Wandeling", 1.0, 0.0, "km"),
                DailyTask("squat", "Squats", 10.0, 0.0, "reps"),
                DailyTask("important", "Belangrijke taak", 1.0, 0.0, "task")
            )
        }
        daily.addAll(tasks)
        save()
    }

    fun ensureStepsTask(steps: Long) {
        val task = daily.firstOrNull { it.unit == "steps" }
        if (task != null) {
            task.progress = steps.toDouble()
        } else {
            val goal = when (dailyMode) { "low" -> 2500.0; "high" -> 8000.0; else -> 5000.0 }
            daily.add(DailyTask("steps", "Stappen", goal, steps.toDouble(), "steps"))
        }
        save()
    }

    fun canClaimDaily() = daily.filter { it.enabled }.all { it.progress >= it.goal } && dailyClaimedDate != today()

    fun claimDaily() {
        if (!canClaimDaily()) return
        val reward = 35 + daily.filter { it.enabled }.sumOf { t ->
            when (t.unit) {
                "steps" -> (t.goal / 300).toInt()
                "km" -> (t.goal * 14).toInt()
                "min" -> (t.goal * 1.5).toInt()
                "reps" -> (t.goal * .7).toInt()
                else -> 8
            }
        }
        dailyClaimedDate = today()
        gold += reward
        dKeys++
        fatigue = (fatigue - 5).coerceAtLeast(0)
        addXp(reward)
    }

    fun allocate(stat: String): Boolean {
        if (abilityPoints <= 0) return false
        abilityPoints--
        when (stat) {
            "STR" -> str++
            "VIT" -> vit++
            "AGI" -> agi++
            "INT" -> intStat++
            "PER" -> per++
        }
        save(); return true
    }

    fun save() {
        val root = JSONObject()
        root.put("level", level).put("xp", xp).put("nextXp", nextXp).put("gold", gold)
            .put("shadowEnergy", shadowEnergy).put("eKeys", eKeys).put("dKeys", dKeys).put("cKeys", cKeys)
            .put("abilityPoints", abilityPoints).put("fatigue", fatigue).put("hp", hp).put("mp", mp)
            .put("str", str).put("vit", vit).put("agi", agi).put("int", intStat).put("per", per)
            .put("dailyMode", dailyMode).put("dailyClaimedDate", dailyClaimedDate).put("recoveryDate", recoveryDate)
            .put("activeQuestId", activeQuestId ?: JSONObject.NULL).put("activeQuestStartedAt", activeQuestStartedAt)
        root.put("quests", JSONArray().also { arr -> quests.forEach { q -> arr.put(JSONObject().apply {
            put("id",q.id);put("name",q.name);put("description",q.description);put("xp",q.xp);put("gold",q.gold);put("minutes",q.minutes)
            put("category",q.category);put("stat",q.stat);put("repeat",q.repeat);put("doneDate",q.doneDate);put("refusedDate",q.refusedDate);put("postponedUntil",q.postponedUntil)
        }) } })
        root.put("daily", JSONArray().also { arr -> daily.forEach { t -> arr.put(JSONObject().apply {
            put("id",t.id);put("name",t.name);put("goal",t.goal);put("progress",t.progress);put("unit",t.unit);put("enabled",t.enabled)
        }) } })
        root.put("consumables", JSONObject(consumables as Map<*, *>))
        prefs.edit().putString("state", root.toString()).apply()
    }

    private fun load() {
        val raw = prefs.getString("state", null)
        if (raw == null) {
            quests.addAll(defaultQuests())
            setDailyPreset("normal")
            hp = maxHp; mp = maxMp
            return
        }
        try {
            val o = JSONObject(raw)
            level=o.optInt("level",1);xp=o.optInt("xp",0);nextXp=o.optInt("nextXp",100);gold=o.optInt("gold",150)
            shadowEnergy=o.optInt("shadowEnergy",0);eKeys=o.optInt("eKeys",2);dKeys=o.optInt("dKeys",0);cKeys=o.optInt("cKeys",0)
            abilityPoints=o.optInt("abilityPoints",0);fatigue=o.optInt("fatigue",0);str=o.optInt("str",12);vit=o.optInt("vit",11);agi=o.optInt("agi",10);intStat=o.optInt("int",10);per=o.optInt("per",11)
            dailyMode=o.optString("dailyMode","normal");dailyClaimedDate=o.optString("dailyClaimedDate","");recoveryDate=o.optString("recoveryDate","")
            activeQuestId=if(o.isNull("activeQuestId")) null else o.optString("activeQuestId");activeQuestStartedAt=o.optLong("activeQuestStartedAt",0)
            quests.clear(); val qa=o.optJSONArray("quests") ?: JSONArray(); for(i in 0 until qa.length()){val q=qa.getJSONObject(i);quests.add(Quest(q.getString("id"),q.getString("name"),q.optString("description"),q.optInt("xp",40),q.optInt("gold",70),q.optInt("minutes",30),q.optString("category","household"),q.optString("stat","vit"),q.optString("repeat","daily"),q.optString("doneDate"),q.optString("refusedDate"),q.optString("postponedUntil")))}
            daily.clear(); val da=o.optJSONArray("daily") ?: JSONArray(); for(i in 0 until da.length()){val t=da.getJSONObject(i);daily.add(DailyTask(t.getString("id"),t.getString("name"),t.optDouble("goal",1.0),t.optDouble("progress",0.0),t.optString("unit","task"),t.optBoolean("enabled",true)))}
            val co=o.optJSONObject("consumables"); if(co!=null){for(k in consumables.keys.toList())consumables[k]=co.optInt(k,consumables[k]?:0)}
            hp=o.optInt("hp",maxHp).coerceAtMost(maxHp);mp=o.optInt("mp",maxMp).coerceAtMost(maxMp)
            if(quests.isEmpty())quests.addAll(defaultQuests()); if(daily.isEmpty())setDailyPreset(dailyMode)
        } catch (_: Throwable) {
            quests.clear();quests.addAll(defaultQuests());setDailyPreset("normal");hp=maxHp;mp=maxMp
        }
    }

    fun reset() { prefs.edit().clear().apply(); context.getSharedPreferences("system_native_v104",Context.MODE_PRIVATE).edit().clear().apply() }

    private fun defaultQuests() = listOf(
        Quest("catbox","Kattenbak Raid","Kattenbak schoonmaken en omgeving resetten.",30,50,15,"household","vit"),
        Quest("sweep","Dungeon Sweep","Reset één deel van het huis.",40,70,30,"household","vit"),
        Quest("work","Work Prep","Kleding, tas, sleutels en OV klaarzetten.",25,40,15,"admin","int"),
        Quest("walk","Shadow Walk","Realistische wandeling buiten.",35,60,30,"movement","agi"),
        Quest("focus","Focus Gate","Telefoon weg en één nuttige taak afmaken.",45,80,35,"admin","per"),
        Quest("kitchen","Kitchen Reset","Maak de keuken weer bruikbaar.",65,110,50,"household","vit","weekly"),
        Quest("training","Training Arc","Realistische fysieke training.",50,90,30,"training","str","weekly")
    )
}
