package com.remon.thesystem

import kotlin.math.max
import kotlin.math.roundToInt
import kotlin.random.Random

data class EnemyTemplate(
    val name: String,
    val rank: String,
    val hp: Int,
    val attack: Int,
    val defense: Int,
    val breakMax: Int,
    val boss: Boolean = false
)

data class Intent(
    val name: String,
    val minDamage: Int,
    val maxDamage: Int,
    val tag: String,
    val interruptBreak: Int = 0,
    val bleed: Boolean = false,
    val stealsGold: Boolean = false,
    val hits: Int = 1
)

data class BattleSnapshot(
    val enemyName: String,
    val enemyHp: Int,
    val enemyMaxHp: Int,
    val enemyBreak: Int,
    val enemyBreakMax: Int,
    val playerHp: Int,
    val playerMp: Int,
    val ap: Int,
    val round: Int,
    val intent: Intent,
    val analyzed: Boolean,
    val broken: Boolean,
    val bleedTurns: Int,
    val log: List<String>,
    val finished: Boolean,
    val victory: Boolean
)

class BattleEngine(private val store: GameStore) {
    private val goblin = EnemyTemplate("Goblin Scout", "E", 130, 14, 4, 45)
    private val wolf = EnemyTemplate("Steel Fang Wolf", "E", 165, 18, 5, 55)
    private val guard = EnemyTemplate("Dungeon Guard", "D", 215, 23, 9, 70)
    private val spider = EnemyTemplate("Poison Spider", "D", 190, 22, 7, 65)
    private val orc = EnemyTemplate("Armored Orc", "D", 280, 28, 13, 85, true)
    private val minotaur = EnemyTemplate("Raid Boss Minotaur", "C", 520, 36, 16, 120, true)

    var enemy = goblin
        private set
    var enemyHp = goblin.hp
        private set
    var enemyBreak = goblin.breakMax
        private set
    var playerHp = store.maxHp
        private set
    var playerMp = store.maxMp
        private set
    var ap = 2
        private set
    var round = 1
        private set
    var analyzed = false
        private set
    var brokenTurns = 0
        private set
    var bleedTurns = 0
        private set
    var finished = false
        private set
    var victory = false
        private set
    var gateRank = "E"
        private set
    var room = 1
        private set
    var rooms = 2
        private set
    var intent: Intent = Intent("Quick Slash",12,16,"FAST")
        private set
    val logs = mutableListOf<String>()
    private var breakThisRound = 0
    private var guarded = false
    private var perfectGuard = false
    private var sprintTurns = 0
    private var killingIntentTurns = 0
    private var vitalCooldown = 0
    private var rushCooldown = 0
    private var guardShield = 0

    fun start(rank: String) {
        gateRank = rank
        rooms = when(rank){"D"->3;"C"->4;else->2}
        room = 1
        playerHp = store.maxHp
        playerMp = store.maxMp
        finished=false;victory=false
        spawnForRoom()
        logs.clear();logs.add("${enemy.name} appeared. Read the intent before acting.")
        startRound()
    }

    private fun spawnForRoom() {
        enemy = when(gateRank){
            "D" -> when(room){1->spider;2->guard;else->orc}
            "C" -> when(room){1->guard;2->spider;3->orc;else->minotaur}
            else -> if(room==1)goblin else wolf
        }
        val scale = 1f + ((store.level - 2).coerceAtLeast(0) * 0.025f)
        enemyHp = (enemy.hp * scale).roundToInt()
        enemyBreak = enemy.breakMax
        analyzed=false;brokenTurns=0;breakThisRound=0;guarded=false;perfectGuard=false
    }

    private fun startRound() {
        ap=2;breakThisRound=0;guarded=false;perfectGuard=false
        if(vitalCooldown>0)vitalCooldown--
        if(rushCooldown>0)rushCooldown--
        if(sprintTurns>0)sprintTurns--
        if(killingIntentTurns>0)killingIntentTurns--
        if(bleedTurns>0){val d=4;playerHp=(playerHp-d).coerceAtLeast(0);bleedTurns--;logs.add(0,"Bleed dealt $d damage.")}
        if(brokenTurns>0) logs.add(0,"${enemy.name} is BROKEN: +25% damage this round.")
        intent = chooseIntent()
        if(playerHp<=0) lose()
    }

    private fun chooseIntent(): Intent {
        if(enemy.name=="Goblin Scout") return when(round%4){
            1->Intent("Quick Slash",12,16,"FAST")
            2->Intent("Piercing Lunge",28,32,"HEAVY",18,true)
            3->Intent("Dirty Trick",11,14,"TRICK",0,false,true)
            else->Intent("Double Slash",9,11,"MULTI",0,false,false,2)
        }
        if(enemy.name=="Steel Fang Wolf") return if(round%3==0) Intent("Fang Rush",10,13,"MULTI",0,false,false,2) else Intent("Pounce",18,23,"HEAVY",15)
        if(enemy.name=="Poison Spider") return if(round%2==0) Intent("Venom Bite",16,20,"POISON",14,true) else Intent("Web Strike",13,17,"SLOW")
        if(enemy.name=="Dungeon Guard") return if(round%3==0) Intent("Shield Crush",24,29,"HEAVY",20) else Intent("Sword Cut",17,21,"NORMAL")
        if(enemy.name=="Armored Orc") return if(round%2==0) Intent("Overhead Smash",31,38,"HEAVY",22) else Intent("Cleave",21,27,"NORMAL")
        val enraged = enemyHp < enemy.hp/2
        return if(enraged && round%2==0) Intent("Berserker Rush",18,22,"MULTI",28,false,false,2)
        else Intent("Ground Slam",34,42,"BOSS",25)
    }

    fun snapshot() = BattleSnapshot(enemy.name,enemyHp,currentEnemyMaxHp(),enemyBreak,enemy.breakMax,playerHp,playerMp,ap,round,intent,analyzed,brokenTurns>0,bleedTurns,logs.toList(),finished,victory)
    private fun currentEnemyMaxHp(): Int = max(enemyHp, (enemy.hp * (1f + ((store.level - 2).coerceAtLeast(0)*.025f))).roundToInt())

    fun analyze(): String {
        if(!spendAp(1))return "Not enough AP."
        analyzed=true
        val extra = if(intent.interruptBreak>0) " Interrupt at ${intent.interruptBreak} Break this round." else ""
        val text="${intent.name}: ${intent.minDamage}-${intent.maxDamage} damage.${extra} Weakness: ${weakness()}."
        logs.add(0,"ANALYZE — $text")
        autoEnemyTurnIfNeeded()
        return text
    }

    private fun weakness() = when(enemy.name){
        "Dungeon Guard","Armored Orc"->"Break / Authority"
        "Poison Spider"->"fast burst damage"
        "Steel Fang Wolf"->"strong single hits"
        else->"strong single-hit attacks"
    }

    fun attack(timing: String) {
        if(!spendAp(1))return
        val multiplier=when(timing){"PERFECT"->1.25;"MISS"->.70;else->1.0}
        val breakDmg=when(timing){"PERFECT"->10;"MISS"->3;else->6}
        damageEnemy(basePhysical(multiplier),breakDmg,"$timing Attack")
        autoEnemyTurnIfNeeded()
    }

    fun daggerRush(): String {
        if(rushCooldown>0)return "Dagger Rush cooldown: $rushCooldown"
        if(ap<1||playerMp<8)return "Need 1 AP and 8 MP."
        ap--;playerMp-=8;rushCooldown=1
        val first=basePhysical(.62);damageEnemy(first,4,"Dagger Rush hit 1")
        if(enemyHp>0){val second=basePhysical(.62);damageEnemy(second,4,"Dagger Rush hit 2")}
        autoEnemyTurnIfNeeded();return "Dagger Rush used."
    }

    fun vitalStrike(timing: String): String {
        if(vitalCooldown>0)return "Vital Strike cooldown: $vitalCooldown"
        if(ap<2||playerMp<12)return "Need 2 AP and 12 MP."
        ap-=2;playerMp-=12;vitalCooldown=2
        val timingMulti=when(timing){"PERFECT"->1.2;"MISS"->.75;else->1.0}
        damageEnemy(basePhysical(1.75*timingMulti),18,"Vital Strike")
        autoEnemyTurnIfNeeded();return "Vital Strike used."
    }

    fun sprint(): String {
        if(ap<1||playerMp<10)return "Need 1 AP and 10 MP."
        ap--;playerMp-=10;sprintTurns=2;logs.add(0,"Sprint: dodge increased for 2 rounds.");autoEnemyTurnIfNeeded();return "Sprint activated."
    }

    fun killingIntent(): String {
        if(ap<1||playerMp<14)return "Need 1 AP and 14 MP."
        ap--;playerMp-=14;killingIntentTurns=2;logs.add(0,"Killing Intent: enemy attack/defense reduced.");autoEnemyTurnIfNeeded();return "Killing Intent activated."
    }

    fun guard(timing: String) {
        if(!spendAp(1))return
        guarded=true;perfectGuard=timing=="PERFECT";guardShield=if(perfectGuard)80 else 50
        logs.add(0,if(perfectGuard)"PERFECT GUARD prepared." else "Guard prepared.")
        autoEnemyTurnIfNeeded()
    }

    fun potion(name: String): String {
        if(ap<1)return "Need 1 AP."
        val count=store.consumables[name]?:0;if(count<=0)return "No $name left."
        ap--;store.consumables[name]=count-1
        if(name=="Healing Potion"){val heal=45;playerHp=(playerHp+heal).coerceAtMost(store.maxHp);logs.add(0,"Healing Potion restored $heal HP.")}
        if(name=="Mana Potion"){val heal=30;playerMp=(playerMp+heal).coerceAtMost(store.maxMp);logs.add(0,"Mana Potion restored $heal MP.")}
        store.save();autoEnemyTurnIfNeeded();return "$name used."
    }

    fun endTurn(){ if(!finished) enemyTurn() }

    private fun spendAp(cost:Int):Boolean{if(ap<cost){logs.add(0,"Not enough AP.");return false};ap-=cost;return true}

    private fun basePhysical(mult:Double):Int{
        val defenseFactor=if(killingIntentTurns>0).35 else .62
        var dmg=(store.str*1.55+store.level*2.0-enemy.defense*defenseFactor+Random.nextDouble(-2.0,3.5))*mult
        if(brokenTurns>0)dmg*=1.25
        return max(1,dmg.roundToInt())
    }

    private fun damageEnemy(damage:Int,breakDmg:Int,label:String){
        enemyHp=(enemyHp-damage).coerceAtLeast(0);breakThisRound+=breakDmg
        enemyBreak=(enemyBreak-breakDmg).coerceAtLeast(0);logs.add(0,"$label: $damage damage, $breakDmg Break.")
        if(enemyBreak==0&&brokenTurns==0){brokenTurns=1;logs.add(0,"BREAK — ${enemy.name} loses its action and takes +25% damage.")}
        if(enemyHp<=0)enemyDefeated()
    }

    private fun autoEnemyTurnIfNeeded(){ if(!finished&&ap<=0)enemyTurn() }

    private fun enemyTurn(){
        if(finished)return
        if(enemyHp<=0){enemyDefeated();return}
        if(brokenTurns>0){
            logs.add(0,"${enemy.name}'s action was cancelled by BREAK.")
            brokenTurns--
            if(brokenTurns==0)enemyBreak=enemy.breakMax
            nextRound();return
        }
        if(intent.interruptBreak>0&&breakThisRound>=intent.interruptBreak){
            logs.add(0,"INTERRUPT — ${intent.name} was cancelled by $breakThisRound Break damage.")
            nextRound();return
        }
        val dodgeBase=.04+store.agi*.003+(if(sprintTurns>0).18 else 0.0)
        if(Random.nextDouble()<dodgeBase){logs.add(0,"You evaded ${intent.name}.");nextRound();return}
        repeat(intent.hits){hitIndex->
            var raw=Random.nextInt(intent.minDamage,intent.maxDamage+1)
            if(killingIntentTurns>0)raw=(raw*.78).roundToInt()
            var damage=max(1,raw-(store.vit*.18).roundToInt())
            if(guarded)damage=max(1,(damage*(1.0-guardShield/100.0)).roundToInt())
            playerHp=(playerHp-damage).coerceAtLeast(0)
            logs.add(0,"${intent.name}${if(intent.hits>1)" hit ${hitIndex+1}" else ""}: $damage damage.")
        }
        if(intent.stealsGold){if(guarded)logs.add(0,"Guard blocked Dirty Trick's Gold steal.")else{val stolen=minOf(10,store.gold);store.gold-=stolen;logs.add(0,"Dirty Trick stole $stolen Gold.")}}
        if(intent.bleed&&!guarded){bleedTurns=2;logs.add(0,"BLEED inflicted for 2 rounds.")}
        if(perfectGuard){enemyBreak=(enemyBreak-8).coerceAtLeast(0);logs.add(0,"Perfect Guard counter dealt 8 Break.");if(enemyBreak==0){brokenTurns=1;logs.add(0,"BREAK from Perfect Guard!")}}
        store.save()
        if(playerHp<=0)lose() else nextRound()
    }

    private fun nextRound(){
        if(finished)return
        if(brokenTurns>0){/* broken remains through next player action */}
        round++;startRound()
    }

    private fun enemyDefeated(){
        if(finished)return
        logs.add(0,"${enemy.name} defeated.")
        if(room<rooms){room++;spawnForRoom();round=1;startRound();logs.add(0,"Room $room/$rooms begins.");return}
        finished=true;victory=true
        val xp=when(gateRank){"C"->45;"D"->28;else->18}
        val gold=when(gateRank){"C"->140;"D"->80;else->45}
        store.gold+=gold;store.shadowEnergy+=when(gateRank){"C"->8;"D"->4;else->2};store.addXp(xp)
        store.hp=playerHp.coerceAtLeast(1);store.mp=playerMp;store.save()
        logs.add(0,"GATE CLEARED: +$xp XP, +$gold Gold.")
    }

    private fun lose(){finished=true;victory=false;store.fatigue=(store.fatigue+5).coerceAtMost(100);store.hp=1;store.save();logs.add(0,"DEFEAT — expelled from the Gate.")}
}
