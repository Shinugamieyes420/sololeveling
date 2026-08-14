package com.remon.thesystem

import android.content.Context
import org.json.JSONObject

data class GearEntryV11(
    val id: String,
    val name: String,
    val slot: String,
    val rank: String,
    val price: Int,
    val description: String,
    val str: Int = 0,
    val vit: Int = 0,
    val agi: Int = 0,
    val intStat: Int = 0,
    val per: Int = 0
)

class FeatureStoreV11(private val context: Context) {
    private val prefs = context.getSharedPreferences("system_features_v11", Context.MODE_PRIVATE)

    val catalog = listOf(
        GearEntryV11("steel_dagger", "Steel Hunter Dagger", "weapon", "E", 120, "+4 STR, +1 PER", str = 4, per = 1),
        GearEntryV11("twin_fang", "Twin Fang Daggers", "weapon", "D", 420, "+7 STR, +4 AGI", str = 7, agi = 4),
        GearEntryV11("shadow_edge", "Shadow Edge", "weapon", "C", 950, "+12 STR, +7 AGI", str = 12, agi = 7),
        GearEntryV11("hunter_jacket", "Hunter Jacket", "armor", "E", 100, "+3 VIT", vit = 3),
        GearEntryV11("gate_armor", "Gate Armor", "armor", "D", 480, "+8 VIT", vit = 8),
        GearEntryV11("demon_guard", "Demon Guard Armor", "armor", "C", 1100, "+13 VIT, +5 INT", vit = 13, intStat = 5),
        GearEntryV11("perception_ring", "Perception Ring", "accessory", "D", 300, "+5 PER", per = 5),
        GearEntryV11("agility_charm", "Agility Charm", "accessory", "D", 340, "+6 AGI", agi = 6),
        GearEntryV11("mana_bracelet", "Mana Bracelet", "accessory", "C", 550, "+7 INT", intStat = 7)
    )

    private val owned = mutableMapOf<String, Int>()
    private val equipped = mutableMapOf("weapon" to "", "armor" to "", "accessory" to "")

    init { load() }

    fun ownedCount(id: String): Int = owned[id] ?: 0
    fun equippedId(slot: String): String = equipped[slot].orEmpty()
    fun equippedItem(slot: String): GearEntryV11? = catalog.firstOrNull { it.id == equippedId(slot) }
    fun ownedGear(): List<GearEntryV11> = catalog.filter { ownedCount(it.id) > 0 }

    fun buyGear(store: PlayerStoreV11, item: GearEntryV11): String {
        if (store.gold < item.price) return "Not enough Gold"
        store.gold -= item.price
        owned[item.id] = ownedCount(item.id) + 1
        store.save(); save()
        return "${item.name} purchased"
    }

    fun buyConsumable(store: PlayerStoreV11, name: String, price: Int): String {
        if (store.gold < price) return "Not enough Gold"
        store.gold -= price
        store.consumables[name] = (store.consumables[name] ?: 0) + 1
        store.save()
        return "$name purchased"
    }

    fun equip(store: PlayerStoreV11, item: GearEntryV11): String {
        if (ownedCount(item.id) <= 0) return "Item not owned"
        val old = equippedItem(item.slot)
        if (old?.id == item.id) return "Already equipped"
        if (old != null) applyStats(store, old, -1)
        applyStats(store, item, 1)
        equipped[item.slot] = item.id
        store.hp = store.hp.coerceAtMost(store.maxHp)
        store.mp = store.mp.coerceAtMost(store.maxMp)
        store.save(); save()
        return "${item.name} equipped"
    }

    fun unequip(store: PlayerStoreV11, slot: String): String {
        val old = equippedItem(slot) ?: return "Nothing equipped"
        applyStats(store, old, -1)
        equipped[slot] = ""
        store.hp = store.hp.coerceAtMost(store.maxHp)
        store.mp = store.mp.coerceAtMost(store.maxMp)
        store.save(); save()
        return "${old.name} unequipped"
    }

    fun sell(store: PlayerStoreV11, item: GearEntryV11): String {
        if (ownedCount(item.id) <= 0) return "Item not owned"
        if (equippedId(item.slot) == item.id) return "Unequip this item first"
        val count = ownedCount(item.id)
        if (count <= 1) owned.remove(item.id) else owned[item.id] = count - 1
        val value = (item.price * 0.45).toInt().coerceAtLeast(1)
        store.gold += value
        store.save(); save()
        return "Sold for $value Gold"
    }

    private fun applyStats(store: PlayerStoreV11, item: GearEntryV11, direction: Int) {
        store.str += item.str * direction
        store.vit += item.vit * direction
        store.agi += item.agi * direction
        store.intStat += item.intStat * direction
        store.per += item.per * direction
    }

    fun clear() { prefs.edit().clear().commit(); owned.clear(); equipped.keys.forEach { equipped[it] = "" } }

    private fun save() {
        val o = JSONObject()
        val own = JSONObject(); owned.forEach { (k, v) -> own.put(k, v) }
        val eq = JSONObject(); equipped.forEach { (k, v) -> eq.put(k, v) }
        o.put("owned", own).put("equipped", eq)
        prefs.edit().putString("state", o.toString()).apply()
    }

    private fun load() {
        val raw = prefs.getString("state", null) ?: return
        try {
            val o = JSONObject(raw)
            val own = o.optJSONObject("owned") ?: JSONObject()
            own.keys().forEach { k -> owned[k] = own.optInt(k, 0) }
            val eq = o.optJSONObject("equipped") ?: JSONObject()
            equipped.keys.toList().forEach { slot -> equipped[slot] = eq.optString(slot, "") }
        } catch (_: Throwable) { }
    }
}
