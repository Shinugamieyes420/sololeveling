package com.remon.thesystem

import kotlin.math.max
import kotlin.math.roundToInt
import kotlin.random.Random

data class V11Enemy(val name:String,val rank:String,val hp:Int,val atk:Int,val def:Int,val breakMax:Int,val boss:Boolean=false)
data class V11Intent(val name:String,val min:Int,val max:Int,val tag:String,val interrupt:Int=0,val bleed:Boolean=false,val hits:Int=1)
data class V11BattleState(val enemy:String,val hp:Int,val maxHp:Int,val breakNow:Int,val breakMax:Int,val playerHp:Int,val playerMp:Int,val ap:Int,val round:Int,val intent:V11Intent,val analyzed:Boolean,val broken:Boolean,val finished:Boolean,val victory:Boolean,val log:List<String>)

class BattleEngineV11(private val store:PlayerStoreV11){
    private val goblin=V11Enemy("Goblin Scout","E",130,14,4,45)
    private val wolf=V11Enemy("Steel Fang Wolf","E",165,18,5,55)
    private val guard=V11Enemy("Dungeon Guard","D",215,23,9,70)
    private val spider=V11Enemy("Poison Spider","D",190,22,7,65)
    private val orc=V11Enemy("Armored Orc","D",285,29,13,85,true)
    private val minotaur=V11Enemy("Raid Boss Minotaur","C",520,36,16,120,true)
    private val knight=V11Enemy("Job Change Knight","JOB",390,31,14,105,true)

    var gateRank="E"; private set
    var room=1; private set
    var rooms=2; private set
    var current=goblin; private set
    var enemyHp=130; private set
    var enemyMaxHp=130; private set
    var enemyBreak=45; private set
    var playerHp=store.maxHp; private set
    var playerMp=store.maxMp; private set
    var ap=2; private set
    var round=1; private set
    var analyzed=false; private set
    var brokenTurns=0; private set
    var finished=false; private set
    var victory=false; private set
    var intent=V11Intent("Quick Slash",12,16,"FAST"); private set
    val logs=mutableListOf<String>()
    private var breakThisRound=0
    private var guarded=false
    private var perfectGuard=false
    private var bleedTurns=0
    private var rushCd=0
    private var vitalCd=0

    fun start(rank:String){
        gateRank=rank;rooms=when(rank){"D"->3;"C"->4;"JOB"->1;else->2};room=1;playerHp=store.maxHp;playerMp=store.maxMp;finished=false;victory=false;logs.clear();spawn();startRound();logs.add(0,"${current.name} appeared.")
    }
    private fun spawn(){
        current=when(gateRank){"D"->when(room){1->spider;2->guard;else->orc};"C"->when(room){1->guard;2->spider;3->orc;else->minotaur};"JOB"->knight;else->if(room==1)goblin else wolf}
        val scale=1f+((store.level-2).coerceAtLeast(0)*.02f);enemyMaxHp=(current.hp*scale).roundToInt();enemyHp=enemyMaxHp;enemyBreak=current.breakMax;analyzed=false;brokenTurns=0;breakThisRound=0
    }
    private fun startRound(){ap=2;breakThisRound=0;guarded=false;perfectGuard=false;if(rushCd>0)rushCd--;if(vitalCd>0)vitalCd--;if(bleedTurns>0){playerHp=(playerHp-4).coerceAtLeast(0);bleedTurns--;logs.add(0,"Bleed dealt 4 damage.")};intent=chooseIntent();if(playerHp<=0)lose()}
    private fun chooseIntent():V11Intent{
        if(current.name=="Goblin Scout")return when(round%4){1->V11Intent("Quick Slash",12,16,"FAST");2->V11Intent("Piercing Lunge",28,32,"HEAVY",18,true);3->V11Intent("Dirty Trick",11,14,"TRICK");else->V11Intent("Double Slash",9,11,"MULTI",0,false,2)}
        if(current.name=="Steel Fang Wolf")return if(round%3==0)V11Intent("Fang Rush",10,13,"MULTI",0,false,2) else V11Intent("Pounce",18,23,"HEAVY",15)
        if(current.name=="Poison Spider")return if(round%2==0)V11Intent("Venom Bite",16,20,"POISON",14,true) else V11Intent("Web Strike",13,17,"SLOW")
        if(current.name=="Dungeon Guard")return if(round%3==0)V11Intent("Shield Crush",24,29,"HEAVY",20) else V11Intent("Sword Cut",17,21,"NORMAL")
        if(current.name=="Job Change Knight")return if(round%3==0)V11Intent("Execution Arc",34,40,"BOSS",24) else V11Intent("Knight Assault",20,26,"HEAVY",18)
        if(current.name=="Raid Boss Minotaur")return if(enemyHp<enemyMaxHp/2)V11Intent("Berserker Rush",18,22,"MULTI",28,false,2) else V11Intent("Ground Slam",34,42,"BOSS",25)
        return if(round%2==0)V11Intent("Overhead Smash",31,38,"HEAVY",22) else V11Intent("Cleave",21,27,"NORMAL")
    }
    fun state()=V11BattleState(current.name,enemyHp,enemyMaxHp,enemyBreak,current.breakMax,playerHp,playerMp,ap,round,intent,analyzed,brokenTurns>0,finished,victory,logs.toList())
    fun analyze():String{if(!spend(1))return"Not enough AP";analyzed=true;val t="${intent.name}: ${intent.min}-${intent.max} damage${if(intent.interrupt>0)", interrupt at ${intent.interrupt} Break" else ""}.";logs.add(0,"ANALYZE — $t");autoTurn();return t}
    fun attack(quality:String){if(!spend(1))return;val m=when(quality){"PERFECT"->1.25;"MISS"->.70;else->1.0};val br=when(quality){"PERFECT"->10;"MISS"->3;else->6};hit(baseDamage(m),br,"$quality Attack");autoTurn()}
    fun daggerRush():String{if(store.level<4)return"Unlocks at level 4";if(rushCd>0)return"Cooldown $rushCd";if(ap<1||playerMp<8)return"Need 1 AP and 8 MP";ap--;playerMp-=8;rushCd=2;hit(baseDamage(.62),4,"Dagger Rush I");if(enemyHp>0)hit(baseDamage(.62),4,"Dagger Rush II");autoTurn();return"Dagger Rush"}
    fun vitalStrike(quality:String):String{if(store.level<8)return"Unlocks at level 8";if(vitalCd>0)return"Cooldown $vitalCd";if(ap<2||playerMp<12)return"Need 2 AP and 12 MP";ap-=2;playerMp-=12;vitalCd=3;val m=when(quality){"PERFECT"->2.0;"MISS"->1.2;else->1.7};hit(baseDamage(m),18,"Vital Strike");autoTurn();return"Vital Strike"}
    fun guard(quality:String){if(!spend(1))return;guarded=true;perfectGuard=quality=="PERFECT";logs.add(0,if(perfectGuard)"PERFECT GUARD" else "Guard prepared");autoTurn()}
    fun potion(name:String):String{if(ap<1)return"Need 1 AP";val n=store.consumables[name]?:0;if(n<=0)return"No $name";ap--;store.consumables[name]=n-1;if(name.startsWith("Healing"))playerHp=(playerHp+45).coerceAtMost(store.maxHp) else playerMp=(playerMp+30).coerceAtMost(store.maxMp);store.save();autoTurn();return"$name used"}
    fun endTurn(){if(!finished)enemyTurn()}
    private fun spend(n:Int):Boolean{if(ap<n){logs.add(0,"Not enough AP");return false};ap-=n;return true}
    private fun baseDamage(mult:Double):Int{var d=(store.str*1.6+store.level*2-current.def*.6+Random.nextDouble(-2.0,3.0))*mult;if(brokenTurns>0)d*=1.25;return max(1,d.roundToInt())}
    private fun hit(dmg:Int,br:Int,label:String){enemyHp=(enemyHp-dmg).coerceAtLeast(0);enemyBreak=(enemyBreak-br).coerceAtLeast(0);breakThisRound+=br;logs.add(0,"$label: $dmg damage, $br Break");if(enemyBreak==0&&brokenTurns==0){brokenTurns=2;logs.add(0,"BREAK — action cancelled; +25% damage next turn")};if(enemyHp<=0)defeated()}
    private fun autoTurn(){if(!finished&&ap<=0)enemyTurn()}
    private fun enemyTurn(){
        if(finished)return;if(enemyHp<=0){defeated();return}
        if(brokenTurns>0){logs.add(0,"${current.name}'s action was cancelled by BREAK");brokenTurns--;nextRound();return}
        if(intent.interrupt>0&&breakThisRound>=intent.interrupt){logs.add(0,"INTERRUPT — ${intent.name} cancelled");nextRound();return}
        repeat(intent.hits){var d=Random.nextInt(intent.min,intent.max+1)-(store.vit*.18).roundToInt();d=max(1,d);if(guarded)d=max(1,(d*(if(perfectGuard).2 else .5)).roundToInt());playerHp=(playerHp-d).coerceAtLeast(0);logs.add(0,"${intent.name}: $d damage")}
        if(intent.bleed&&!guarded){bleedTurns=2;logs.add(0,"BLEED inflicted")}
        if(perfectGuard){enemyBreak=(enemyBreak-8).coerceAtLeast(0);logs.add(0,"Perfect Guard: 8 Break")}
        if(playerHp<=0)lose() else nextRound()
    }
    private fun nextRound(){round++;if(brokenTurns==0&&enemyBreak==0)enemyBreak=current.breakMax;startRound()}
    private fun defeated(){
        if(finished)return;logs.add(0,"${current.name} defeated")
        if(room<rooms){room++;spawn();round=1;startRound();logs.add(0,"ROOM $room / $rooms");return}
        finished=true;victory=true
        if(gateRank=="JOB"){store.completeJobChange();store.addXp(60);store.gold+=120;store.save();logs.add(0,"JOB CHANGE COMPLETE — NECROMANCER")}
        else{val xp=when(gateRank){"C"->45;"D"->28;else->18};val g=when(gateRank){"C"->140;"D"->80;else->45};store.completeGate(gateRank,xp,g);logs.add(0,"GATE CLEARED: +$xp XP, +$g Gold")}
    }
    private fun lose(){finished=true;victory=false;store.fatigue=(store.fatigue+5).coerceAtMost(100);store.hp=1;store.save();logs.add(0,"DEFEAT")}
}
