package com.remon.thesystem

import android.annotation.SuppressLint
import android.graphics.Color
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
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
import java.util.zip.GZIPInputStream

class MainActivity : ComponentActivity() {
    private lateinit var webView: WebView
    private var healthClient: HealthConnectClient? = null
    private val stepPermission = HealthPermission.getReadPermission(StepsRecord::class)

    private val requestHealthPermissions = registerForActivityResult(
        PermissionController.createRequestPermissionResultContract()
    ) { granted ->
        if (granted.contains(stepPermission)) readTodaySteps()
        else sendStepError("Steps permission was not granted.")
    }

    @SuppressLint("SetJavaScriptEnabled", "JavascriptInterface")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        webView = WebView(this).apply {
            setBackgroundColor(Color.rgb(2, 6, 13))
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.allowFileAccess = false
            settings.allowContentAccess = false
            settings.setSupportZoom(false)
            settings.builtInZoomControls = false
            settings.displayZoomControls = false
            webChromeClient = WebChromeClient()
            webViewClient = WebViewClient()
            addJavascriptInterface(AndroidBridge(), "Android")
        }
        setContentView(webView)
        loadGame()

        if (HealthConnectClient.getSdkStatus(this) == HealthConnectClient.SDK_AVAILABLE) {
            healthClient = HealthConnectClient.getOrCreate(this)
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                webView.evaluateJavascript("(window.androidBack && window.androidBack()) ? 'true' : 'false'") { value ->
                    if (value != "\"true\"") finish()
                }
            }
        })
    }

    private fun loadGame() {
        val html = GZIPInputStream(assets.open("index.html.gz"))
            .bufferedReader(Charsets.UTF_8).use { it.readText() }
        webView.loadDataWithBaseURL("https://thesystem.local/", html, "text/html", "UTF-8", null)
    }

    private fun requestTodaySteps() {
        val client = healthClient
        if (client == null) {
            sendStepError("Health Connect is unavailable or needs an update.")
            return
        }
        lifecycleScope.launch {
            try {
                val granted = client.permissionController.getGrantedPermissions()
                if (granted.contains(stepPermission)) readTodaySteps()
                else requestHealthPermissions.launch(setOf(stepPermission))
            } catch (t: Throwable) {
                sendStepError("Could not open Health Connect: ${t.message ?: "unknown error"}")
            }
        }
    }

    private fun readTodaySteps() {
        val client = healthClient ?: return
        lifecycleScope.launch {
            try {
                val zone = ZoneId.systemDefault()
                val start = LocalDate.now(zone).atStartOfDay(zone).toInstant()
                val result = client.aggregate(
                    AggregateRequest(
                        metrics = setOf(StepsRecord.COUNT_TOTAL),
                        timeRangeFilter = TimeRangeFilter.between(start, Instant.now())
                    )
                )
                val steps = result[StepsRecord.COUNT_TOTAL] ?: 0L
                webView.post {
                    webView.evaluateJavascript("window.onNativeSteps && window.onNativeSteps($steps);", null)
                }
            } catch (t: Throwable) {
                sendStepError("Steps could not be read: ${t.message ?: "unknown error"}")
            }
        }
    }

    private fun sendStepError(message: String) {
        val safe = message.replace("\\", "\\\\").replace("'", "\\'").replace("\n", " ")
        webView.post {
            webView.evaluateJavascript("window.onNativeStepError && window.onNativeStepError('$safe');", null)
        }
    }

    inner class AndroidBridge {
        @JavascriptInterface fun requestTodaySteps() = runOnUiThread { this@MainActivity.requestTodaySteps() }

        @JavascriptInterface fun vibrate(milliseconds: Int) {
            val ms = milliseconds.coerceIn(1, 500).toLong()
            runOnUiThread {
                val vibrator = getSystemService(VIBRATOR_SERVICE) as Vibrator
                vibrator.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE))
            }
        }

        @JavascriptInterface fun appVersion(): String = "10.4"
    }
}
