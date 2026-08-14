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
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.ScrollView
import android.widget.Space
import android.widget.TextView
import android.widget.Toast
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

    private val bg = Color.rgb(1, 4, 9)
    private val blue = Color.rgb(128, 234, 255)
    private val green = Color.rgb(72, 255, 173)
    private val muted = Color.rgb(132, 158, 177)
    private val red = Color.rgb(255, 93, 134)
    private val gold = Color.rgb(255, 215, 123)
    private val purple = Color.rgb(197, 166, 255)

    private val widthDp: Float get() = resources.displayMetrics.widthPixels / resources.displayMetrics.density
    private val compact: Boolean get() = widthDp < 380f
    private fun scaledSp(value: Float) = value * (widthDp / 412f).coerceIn(.87f, 1.13f)
    private val Int.dp: Int get() = (this * resources.displayMetrics.density).roundToInt()
    private val stepPermission = HealthPermission.getReadPermission(StepsRecord::class)

    private val requestHealth = registerForActivityResult(
        PermissionController.createRequestPermissionResultContract()
    ) { granted ->
        if (granted.contains(stepPermission)) readSteps() else toast("Steps permission not granted")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = bg
        window.navigationBarColor = bg
        store = PlayerStoreV11(this)
        battle = BattleEngineV11(store)
        if (HealthConnectClient.getSdkStatus(this) == HealthConnectClient.SDK_AVAILABLE) {
            healthClient = HealthConnectClient.getOrCreate(this)
        }
        buildShell()
        show("HUD")
        if (!store.awakeningSeen) Handler(Looper.getMainLooper()).postDelayed({ showAwakening() }, 250)
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (screen != "HUD") show("HUD") else finish()
            }
        })
    }

    private fun buildShell() {
        root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(bg)
            setOnApplyWindowInsetsListener { view, insets ->
                val safe = insets.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
                view.setPadding(0, safe.top, 0, safe.bottom)
                insets
            }
        }
        val top = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL
            gravity = Gravity.CENTER_VERTICAL
            setPadding(if (compact) 10.dp else 14.dp, 8.dp, if (compact) 10.dp else 14.dp, 8.dp)
        }
        header = TextView(this).apply {
            setTextColor(blue)
            textSize = scaledSp(10f)
            setTypeface(Typeface.DEFAULT, Typeface.BOLD)
            letterSpacing = .10f
            gravity = Gravity.CENTER_VERTICAL
        }
        top.addView(header, LinearLayout.LayoutParams(0, 46.dp, 1f))
        top.addView(systemButton("SYSTEM MENU", blue) { openMenu() }, LinearLayout.LayoutParams(if (compact) 118.dp else 142.dp, 46.dp))
        root.addView(top)
        root.addView(View(this).apply { setBackgroundColor(Color.argb(80, 128, 234, 255)) }, LinearLayout.LayoutParams(-1, 1.dp))
        val scroll = ScrollView(this).apply {
            isFillViewport = true
            overScrollMode = View.OVER_SCROLL_NEVER
        }
        content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(if (compact) 10.dp else 14.dp, 14.dp, if (compact) 10.dp else 14.dp, 22.dp)
        }
        scroll.addView(content, ViewGroup.LayoutParams(-1, -2))
        root.addView(scroll, LinearLayout.LayoutParams(-1, 0, 1f))
        setContentView(root)
    }

    private fun show(name: String) {
        screen = name
        content.removeAllViews()
        updateHeader()
        when (name) {
            "HUD" -> renderHud()
            "QUEST" -> renderQuests()
            "DAILY" -> renderDaily()
            "GATE" -> renderGate()
            "SHOP" -> renderShop()
            "STATUS" -> renderStatus()
            "UPDATE" -> renderUpdate()
        }
    }

    private fun updateHeader() {
        header.text = "THE SYSTEM  •  ${store.playerName.uppercase()}  •  LV.${store.level}  •  RANK ${store.hunterRank}"
    }

    private fun openMenu() {
        val box = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(14.dp, 10.dp, 14.dp, 10.dp)
            setBackgroundColor(bg)
        }
        val dialog = AlertDialog.Builder(this).setTitle("SYSTEM MENU").setView(box).create()
        val items = listOf(
            "HUD" to "STATUS",
            "QUEST" to "QUEST INFO",
            "DAILY" to "DAILY QUEST",
            "GATE" to "GATE ACCESS",
            "SHOP" to "SYSTEM SHOP",
            "STATUS" to "PLAYER STATS",
            "UPDATE" to "SYSTEM UPDATE"
        )
        items.forEach { (id, label) ->
            box.addView(systemButton(label, if (id == screen) green else blue) {
                dialog.dismiss(); show(id)
            }, LinearLayout.LayoutParams(-1, 48.dp).apply { setMargins(0, 3.dp, 0, 3.dp) })
        }
        dialog.show()
    }

    private fun showAwakening() {
        val wrap = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(20.dp, 8.dp, 20.dp, 0)
            setBackgroundColor(bg)
        }
        wrap.addView(systemText("SYSTEM DETECTED", blue, 13f, true))
        wrap.addView(systemText("PLAYER REGISTRATION", Color.WHITE, 24f, true, true))
        wrap.addView(systemText("A new Player has been recognized. Register a name to initialize the System.", muted, 12f, true))
        val input = EditText(this).apply {
            hint = "PLAYER NAME"
            setHintTextColor(muted)
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            setBackgroundResource(R.drawable.system_input)
            setPadding(8.dp, 8.dp, 8.dp, 8.dp)
        }
        wrap.addView(input, LinearLayout.LayoutParams(-1, 52.dp).apply { setMargins(0, 12.dp, 0, 0) })
        val dialog = AlertDialog.Builder(this).setView(wrap).setCancelable(false).setPositiveButton("REGISTER", null).create()
        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                store.registerPlayer(input.text.toString())
                dialog.dismiss()
                show("HUD")
                toast("PLAYER REGISTRATION COMPLETE")
            }
        }
        dialog.show()
    }

    private fun systemTitle(main: String, sub: String): View {
        return LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(3.dp, 8.dp, 3.dp, 14.dp)
            addView(systemText(main, Color.WHITE, if (compact) 20f else 24f, true, true).apply { letterSpacing = .14f })
            addView(systemText(sub, muted, 9f, true))
        }
    }

    private fun panel(): LinearLayout = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
        setPadding(if (compact) 12.dp else 16.dp, 14.dp, if (compact) 12.dp else 16.dp, 14.dp)
        setBackgroundResource(R.drawable.system_panel)
    }

    private fun systemText(value: String, color: Int = Color.WHITE, size: Float = 14f, center: Boolean = false, bold: Boolean = false): TextView {
        return TextView(this).apply {
            text = value
            setTextColor(color)
            textSize = scaledSp(size)
            gravity = if (center) Gravity.CENTER else Gravity.START
            if (bold) setTypeface(Typeface.DEFAULT, Typeface.BOLD)
            setLineSpacing(2f, 1f)
            setPadding(3.dp, 4.dp, 3.dp, 4.dp)
        }
    }

    private fun systemButton(value: String, color: Int = blue, click: () -> Unit): TextView {
        return TextView(this).apply {
            text = value
            setTextColor(color)
            textSize = scaledSp(11f)
            gravity = Gravity.CENTER
            setTypeface(Typeface.DEFAULT, Typeface.BOLD)
            letterSpacing = .06f
            setBackgroundResource(R.drawable.system_button)
            isClickable = true
            isFocusable = true
            setPadding(8.dp, 8.dp, 8.dp, 8.dp)
            setOnClickListener { click() }
        }
    }

    private fun add(view: View, gap: Int = 9) {
        content.addView(view, LinearLayout.LayoutParams(-1, -2).apply { setMargins(0, 0, 0, gap.dp) })
    }

    private fun spacer(height: Int) = Space(this).apply { layoutParams = LinearLayout.LayoutParams(1, height.dp) }

    private fun systemBar(value: Int, maxValue: Int, color: Int): ProgressBar {
        return ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            max = max(1, maxValue)
            progress = value.coerceIn(0, max)
            progressTintList = ColorStateList.valueOf(color)
            progressBackgroundTintList = ColorStateList.valueOf(Color.argb(35, 255, 255, 255))
            minimumHeight = 6.dp
        }
    }

    private fun renderHud() {
        add(systemTitle("STATUS", "PLAYER INFORMATION"), 3)
        val status = panel()
        status.addView(systemText(store.level.toString(), Color.WHITE, if (compact) 58f else 72f, true, true))
        status.addView(systemText("LEVEL", blue, 10f, true, true))
        status.addView(spacer(7))
        status.addView(systemText("HUNTER RANK     ${store.hunterRank}\nJOB                     ${store.job}\nTITLE                   ${store.title}\nPOWER                 ${store.power}", muted, 13f, true))
        status.addView(spacer(10))
        status.addView(systemText("HP   ${store.hp} / ${store.maxHp}", Color.WHITE, 10f))
        status.addView(systemBar(store.hp, store.maxHp, green))
        status.addView(systemText("MP   ${store.mp} / ${store.maxMp}", Color.WHITE, 10f))
        status.addView(systemBar(store.mp, store.maxMp, blue))
        status.addView(systemText("XP   ${store.xp} / ${store.nextXp}", Color.WHITE, 10f))
        status.addView(systemBar(store.xp, store.nextXp, purple))
        status.addView(systemText("FATIGUE ${store.fatigue}%   •   AP ${store.abilityPoints}", muted, 10f, true))
        add(status, 14)

        if (store.jobChangeAvailable) {
            val notice = panel()
            notice.addView(systemText("SYSTEM NOTIFICATION", gold, 10f, true, true))
            notice.addView(systemText("JOB CHANGE QUEST AVAILABLE", Color.WHITE, 18f, true, true))
            notice.addView(systemText("A special dungeon has appeared. Clear it to unlock your hidden class.", muted, 11f, true))
            notice.addView(spacer(6))
            notice.addView(systemButton("OPEN JOB CHANGE DUNGEON", gold) { show("GATE") })
            add(notice, 14)
        }

        val active = store.quests.firstOrNull { it.id == store.activeQuestId }
        val current = panel()
        current.addView(systemText(if (active == null) "NO QUEST ACTIVE" else "CURRENT QUEST", blue, 10f, true, true))
        current.addView(systemText(active?.name?.uppercase() ?: "SYSTEM STANDBY", Color.WHITE, 20f, true, true))
        current.addView(systemText(active?.description ?: "Real-life quests are the main source of XP and Gate Keys.", muted, 11f, true))
        if (active != null) {
            current.addView(spacer(6))
            current.addView(systemButton("CLAIM REWARD", green) {
                store.completeQuest(active)
                toast("+${active.xp} XP  +${active.gold} Gold")
                show("HUD")
            })
        }
        add(current, 14)

        add(systemTitle("AVAILABLE QUESTS", "REAL-LIFE DIRECTIVES"), 3)
        store.quests.filter { it.doneDate != store.today() }.take(4).forEach { add(questCard(it), 7) }
    }

    private fun questCard(quest: V11Quest): View {
        val card = panel()
        val rank = when {
            quest.xp >= 70 -> "A"
            quest.xp >= 50 -> "B"
            quest.xp >= 35 -> "C"
            quest.xp >= 25 -> "D"
            else -> "E"
        }
        card.addView(systemText("[$rank-RANK]  ${quest.name.uppercase()}", Color.WHITE, 14f, false, true))
        card.addView(systemText(quest.description, muted, 11f))
        card.addView(systemText("${quest.minutes} MIN   •   +${quest.xp} XP   •   +${quest.gold} G", blue, 9f))
        card.addView(spacer(5))
        card.addView(systemButton(if (store.activeQuestId == quest.id) "ACTIVE" else "ACCEPT QUEST", if (store.activeQuestId == quest.id) green else blue) {
            store.activeQuestId = quest.id
            store.save()
            show("HUD")
        })
        return card
    }

    private fun renderQuests() {
        add(systemTitle("QUEST INFO", "SYSTEM DIRECTIVES"), 3)
        store.quests.forEach { add(questCard(it), 7) }
    }

    private fun renderDaily() {
        add(systemTitle("DAILY QUEST", "STRENGTHEN THE PLAYER"), 3)
        val modes = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        listOf("low", "normal", "high").forEach { mode ->
            modes.addView(systemButton(mode.uppercase(), if (store.dailyMode == mode) green else muted) {
                store.setDailyPreset(mode); show("DAILY")
            }, LinearLayout.LayoutParams(0, 44.dp, 1f).apply { setMargins(2.dp, 0, 2.dp, 0) })
        }
        add(modes, 10)
        store.daily.forEach { task ->
            val box = panel()
            box.addView(systemText(task.name.uppercase(), Color.WHITE, 13f, false, true))
            val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL }
            val input = EditText(this).apply {
                setText(if (task.progress % 1.0 == 0.0) task.progress.toInt().toString() else String.format("%.1f", task.progress))
                setTextColor(Color.WHITE)
                gravity = Gravity.CENTER
                inputType = InputType.TYPE_CLASS_NUMBER or InputType.TYPE_NUMBER_FLAG_DECIMAL
                setBackgroundResource(R.drawable.system_input)
                setSelectAllOnFocus(true)
            }
            row.addView(input, LinearLayout.LayoutParams(0, 44.dp, 1f))
            val goal = if (task.goal % 1.0 == 0.0) task.goal.toInt().toString() else task.goal.toString()
            row.addView(systemText(" / $goal ${task.unit.uppercase()}", muted, 10f, true), LinearLayout.LayoutParams(0, 44.dp, 1f))
            row.addView(systemButton("SET", green) {
                task.progress = input.text.toString().toDoubleOrNull() ?: task.progress
                store.save(); show("DAILY")
            }, LinearLayout.LayoutParams(74.dp, 44.dp))
            box.addView(row)
            add(box, 7)
        }
        val health = panel()
        health.addView(systemText("HEALTH CONNECT", blue, 12f, true, true))
        health.addView(systemText("Sync today's steps from Samsung Health / Health Connect.", muted, 11f, true))
        health.addView(spacer(5))
        health.addView(systemButton("SYNC STEPS", green) { requestSteps() })
        add(health, 9)
        add(systemButton("CLAIM DAILY REWARD", green) {
            if (store.canClaimDaily()) {
                store.claimDaily(); toast("DAILY QUEST COMPLETE"); show("DAILY")
            } else toast("Daily Quest incomplete")
        })
    }

    private fun renderGate() {
        if (battle.logs.isNotEmpty() && !battle.finished) {
            renderBattle(); return
        }
        add(systemTitle("GATE ACCESS", "DUNGEON ENTRY"), 3)
        val info = panel()
        info.addView(systemText("HUNTER RANK ${store.hunterRank}", blue, 14f, true, true))
        info.addView(systemText("POWER ${store.power}", Color.WHITE, 28f, true, true))
        info.addView(systemText("Higher Gates require both sufficient Hunter Rank and a Gate Key.", muted, 11f, true))
        add(info, 12)
        if (store.jobChangeAvailable) gateCard("JOB CHANGE DUNGEON", "SPECIAL", "Hidden class evaluation. One boss. Failure does not remove a Gate Key.", gold, true) {
            battle.start("JOB"); renderBattle()
        }
        gateCard("E-RANK GATE", "KEYS ${store.eKeys}", "Two rooms. Intended for new Hunters.", green, store.eKeys > 0) {
            store.eKeys--; store.save(); battle.start("E"); renderBattle()
        }
        gateCard("D-RANK GATE", "KEYS ${store.dKeys}", "Three rooms. Requires D-Rank Hunter status.", purple, store.dKeys > 0 && store.rankAllows("D")) {
            store.dKeys--; store.save(); battle.start("D"); renderBattle()
        }
        gateCard("C-RANK GATE", "KEYS ${store.cKeys}", "Boss dungeon. Requires C-Rank Hunter status.", gold, store.cKeys > 0 && store.rankAllows("C")) {
            store.cKeys--; store.save(); battle.start("C"); renderBattle()
        }
    }

    private fun gateCard(name: String, sub: String, description: String, color: Int, enabled: Boolean, go: () -> Unit) {
        val card = panel()
        card.addView(systemText(name, color, 17f, true, true))
        card.addView(systemText(sub, muted, 9f, true))
        card.addView(systemText(description, muted, 11f, true))
        card.addView(spacer(6))
        card.addView(systemButton(if (enabled) "ENTER" else "LOCKED", if (enabled) color else muted) {
            if (enabled) go() else toast("Gate requirements not met")
        })
        add(card, 8)
    }

    private fun renderBattle() {
        content.removeAllViews()
        updateHeader()
        val state = battle.state()
        add(systemTitle("${battle.gateRank}-RANK BATTLE", "ROUND ${state.round}   •   AP ${state.ap}/2"), 3)
        val enemy = panel()
        enemy.addView(systemText(state.enemy, red, 21f, true, true))
        enemy.addView(systemText("HP ${state.hp} / ${state.maxHp}", Color.WHITE, 10f))
        enemy.addView(systemBar(state.hp, state.maxHp, red))
        enemy.addView(systemText("BREAK ${state.breakNow} / ${state.breakMax}", Color.WHITE, 10f))
        enemy.addView(systemBar(state.breakNow, state.breakMax, purple))
        add(enemy, 9)

        val intent = panel()
        intent.addView(systemText("ENEMY INTENT", gold, 9f, true, true))
        intent.addView(systemText(state.intent.name, Color.WHITE, 17f, true, true))
        val details = if (state.analyzed) "${state.intent.min}-${state.intent.max} DAMAGE${if (state.intent.interrupt > 0) "   •   INTERRUPT ${state.intent.interrupt} BREAK" else ""}" else "Use ANALYZE to reveal exact threat data."
        intent.addView(systemText(details, muted, 10f, true))
        add(intent, 9)

        val player = panel()
        player.addView(systemText("PLAYER", blue, 9f, true, true))
        player.addView(systemText("HP ${state.playerHp}/${store.maxHp}   •   MP ${state.playerMp}/${store.maxMp}   •   AP ${state.ap}/2", Color.WHITE, 12f, true))
        add(player, 9)

        if (state.finished) {
            add(systemText(if (state.victory) "GATE CLEARED" else "DEFEAT", if (state.victory) green else red, 27f, true, true), 10)
            add(systemButton("RETURN", green) { battle.logs.clear(); show("GATE") })
            battleLog(state)
            return
        }

        val row1 = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        row1.addView(systemButton("ATTACK • 1 AP", blue) { timing("ATTACK") { battle.attack(it); renderBattle() } }, LinearLayout.LayoutParams(0, 50.dp, 1f).apply { marginEnd = 3.dp })
        row1.addView(systemButton("GUARD • 1 AP", gold) { timing("GUARD") { battle.guard(it); renderBattle() } }, LinearLayout.LayoutParams(0, 50.dp, 1f).apply { marginStart = 3.dp })
        add(row1, 6)
        val row2 = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        row2.addView(systemButton("ANALYZE • 1 AP", Color.WHITE) { toast(battle.analyze()); renderBattle() }, LinearLayout.LayoutParams(0, 50.dp, 1f).apply { marginEnd = 3.dp })
        row2.addView(systemButton("DAGGER RUSH", purple) { toast(battle.daggerRush()); renderBattle() }, LinearLayout.LayoutParams(0, 50.dp, 1f).apply { marginStart = 3.dp })
        add(row2, 6)
        val row3 = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        row3.addView(systemButton("VITAL STRIKE", red) { timing("VITAL STRIKE") { toast(battle.vitalStrike(it)); renderBattle() } }, LinearLayout.LayoutParams(0, 50.dp, 1f).apply { marginEnd = 3.dp })
        row3.addView(systemButton("END TURN", muted) { battle.endTurn(); renderBattle() }, LinearLayout.LayoutParams(0, 50.dp, 1f).apply { marginStart = 3.dp })
        add(row3, 6)
        val row4 = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL }
        row4.addView(systemButton("HEAL ×${store.consumables["Healing Potion"] ?: 0}", green) { toast(battle.potion("Healing Potion")); renderBattle() }, LinearLayout.LayoutParams(0, 48.dp, 1f).apply { marginEnd = 3.dp })
        row4.addView(systemButton("MANA ×${store.consumables["Mana Potion"] ?: 0}", blue) { toast(battle.potion("Mana Potion")); renderBattle() }, LinearLayout.LayoutParams(0, 48.dp, 1f).apply { marginStart = 3.dp })
        add(row4, 9)
        battleLog(state)
    }

    private fun battleLog(state: V11BattleState) {
        val log = panel()
        log.addView(systemText("COMBAT LOG", blue, 10f, true, true))
        state.log.take(10).forEach { log.addView(systemText(it, muted, 10f)) }
        add(log)
    }

    private fun timing(title: String, callback: (String) -> Unit) {
        val wrap = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(20.dp, 10.dp, 20.dp, 2.dp) }
        wrap.addView(systemText("Tap near the center. PERFECT gives the strongest result.", muted, 11f, true))
        val progress = ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal).apply {
            max = 100; this.progress = 0; progressTintList = ColorStateList.valueOf(blue)
        }
        wrap.addView(progress, LinearLayout.LayoutParams(-1, 28.dp))
        val dialog = AlertDialog.Builder(this).setTitle(title).setView(wrap).setPositiveButton("ACT", null).setNegativeButton("CANCEL", null).create()
        val handler = Handler(Looper.getMainLooper())
        var pos = 0
        var direction = 1
        val tick = object : Runnable {
            override fun run() {
                if (!dialog.isShowing) return
                pos += direction * 4
                if (pos >= 100) { pos = 100; direction = -1 }
                if (pos <= 0) { pos = 0; direction = 1 }
                progress.progress = pos
                handler.postDelayed(this, 27)
            }
        }
        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val quality = if (pos in 46..54) "PERFECT" else if (pos in 30..70) "GOOD" else "MISS"
                handler.removeCallbacks(tick)
                dialog.dismiss()
                callback(quality)
            }
            handler.post(tick)
        }
        dialog.setOnDismissListener { handler.removeCallbacks(tick) }
        dialog.show()
    }

    private fun renderShop() {
        add(systemTitle("SYSTEM SHOP", "AUTHORIZED PURCHASES"), 3)
        add(systemText("GOLD  ${store.gold}", gold, 20f, true, true), 8)
        shopItem("Healing Potion", "Restore 45 HP in battle", 35) { store.consumables["Healing Potion"] = (store.consumables["Healing Potion"] ?: 0) + 1 }
        shopItem("Mana Potion", "Restore 30 MP in battle", 40) { store.consumables["Mana Potion"] = (store.consumables["Mana Potion"] ?: 0) + 1 }
        shopItem("E-Rank Gate Key", "Additional E-Rank dungeon entry", 180) { store.eKeys++ }
    }

    private fun shopItem(name: String, description: String, price: Int, grant: () -> Unit) {
        val card = panel()
        card.addView(systemText(name, Color.WHITE, 15f, false, true))
        card.addView(systemText(description, muted, 10f))
        card.addView(systemButton("BUY  •  $price G", gold) {
            if (store.gold >= price) {
                store.gold -= price; grant(); store.save(); show("SHOP")
            } else toast("Not enough Gold")
        })
        add(card, 7)
    }

    private fun renderStatus() {
        add(systemTitle("PLAYER STATUS", "ABILITY DISTRIBUTION"), 3)
        val info = panel()
        info.addView(systemText("HUNTER RANK ${store.hunterRank}   •   RANK PTS ${store.rankPoints}\nJOB ${store.job}   •   POWER ${store.power}\nUNLOCKED SKILLS\n${store.unlockedSkills.joinToString("  •  ")}", muted, 12f, true))
        add(info, 10)
        val stats = listOf("STR" to store.str, "VIT" to store.vit, "AGI" to store.agi, "INT" to store.intStat, "PER" to store.per)
        stats.forEach { (key, value) -> add(systemButton("$key   $value   [+1]", green) { if (store.allocate(key)) show("STATUS") else toast("No Ability Points") }, 6) }
    }

    private fun renderUpdate() {
        add(systemTitle("SYSTEM UPDATE", "STABLE UPDATE CHANNEL"), 3)
        val info = panel()
        info.addView(systemText("INSTALLED VERSION", muted, 9f, true))
        info.addView(systemText("v${BuildConfig.VERSION_NAME}", Color.WHITE, 24f, true, true))
        info.addView(systemText("Future v11.x APKs use the same package identity and signing key, so they can install over this version while keeping this app's save data.", muted, 11f, true))
        info.addView(spacer(8))
        info.addView(systemButton("CHECK FOR UPDATE", green) { checkUpdate() })
        add(info)
    }

    private fun checkUpdate() {
        toast("Checking update channel…")
        Thread {
            try {
                val url = URL("https://raw.githubusercontent.com/Shinugamieyes420/sololeveling/android-v11-stable/android-update/latest.json")
                val connection = (url.openConnection() as HttpURLConnection).apply { connectTimeout = 7000; readTimeout = 7000 }
                val json = JSONObject(connection.inputStream.bufferedReader().use { it.readText() })
                val code = json.optInt("versionCode", 0)
                val version = json.optString("versionName", "")
                val download = json.optString("downloadUrl", "")
                runOnUiThread {
                    if (code > BuildConfig.VERSION_CODE) {
                        AlertDialog.Builder(this).setTitle("UPDATE AVAILABLE").setMessage("Version $version is available.").setPositiveButton("DOWNLOAD") { _, _ ->
                            startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(download)))
                        }.setNegativeButton("LATER", null).show()
                    } else toast("The System is up to date")
                }
            } catch (_: Throwable) {
                runOnUiThread { toast("Update check unavailable") }
            }
        }.start()
    }

    private fun requestSteps() {
        val client = healthClient ?: run { toast("Health Connect unavailable"); return }
        lifecycleScope.launch {
            try {
                val granted = client.permissionController.getGrantedPermissions()
                if (granted.contains(stepPermission)) readSteps() else requestHealth.launch(setOf(stepPermission))
            } catch (_: Throwable) { toast("Health Connect error") }
        }
    }

    private fun readSteps() {
        val client = healthClient ?: return
        lifecycleScope.launch {
            try {
                val zone = ZoneId.systemDefault()
                val start = LocalDate.now(zone).atStartOfDay(zone).toInstant()
                val result = client.aggregate(AggregateRequest(metrics = setOf(StepsRecord.COUNT_TOTAL), timeRangeFilter = TimeRangeFilter.between(start, Instant.now())))
                val steps = result[StepsRecord.COUNT_TOTAL] ?: 0L
                store.ensureStepsTask(steps)
                toast("$steps steps synced")
                show("DAILY")
            } catch (_: Throwable) { toast("Could not read steps") }
        }
    }

    private fun toast(message: String) = Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
}
