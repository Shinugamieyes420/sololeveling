package com.remon.thesystem

import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.widget.TextView

class PermissionsRationaleActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(TextView(this).apply {
            setBackgroundColor(Color.rgb(2, 6, 13))
            setTextColor(Color.rgb(230, 250, 255))
            textSize = 18f
            gravity = Gravity.CENTER
            setPadding(48, 48, 48, 48)
            text = "The System reads only your step count when you tap Sync. Steps update your Daily Quest progress and stay inside the app on your device."
        })
    }
}
