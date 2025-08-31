package com.gamelife

import android.util.Log
import android.view.View
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

class SafeAreaModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SafeAreaModule"
    }

    @ReactMethod
    fun getSafeAreaInsets(promise: Promise) {
        try {
            val activity = currentActivity
            if (activity == null) {
                promise.reject("NO_ACTIVITY", "Activity not available")
                return
            }

            val window = activity.window
            if (window == null) {
                promise.reject("NO_WINDOW", "Window not available")
                return
            }

            val decorView = window.decorView
            val insets = ViewCompat.getRootWindowInsets(decorView)
            
            if (insets == null) {
                promise.reject("NO_INSETS", "Window insets not available")
                return
            }

            val systemBarsInsets = insets.getInsets(WindowInsetsCompat.Type.systemBars())

            // Get screen density to convert physical px to dp
            val density = reactApplicationContext.resources.displayMetrics.density
            
            // Debug logs
            // Log.d("SafeAreaModule", "Screen density: $density")
            // Log.d("SafeAreaModule", "Navigation bar height: ${navigationBarsInsets.bottom}px -> ${navigationBarsInsets.bottom / density}dp")
            // Log.d("SafeAreaModule", "Status bar height: ${statusBarsInsets.top}px -> ${statusBarsInsets.top / density}dp")

            val result: WritableMap = Arguments.createMap()
            
            // Safe area insets (system bars combined) - converted to dp
            result.putDouble("top", (systemBarsInsets.top / density).toDouble())
            result.putDouble("left", (systemBarsInsets.left / density).toDouble())
            result.putDouble("right", (systemBarsInsets.right / density).toDouble())
            result.putDouble("bottom", (systemBarsInsets.bottom / density).toDouble())

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get safe area insets: ${e.message}")
        }
    }
}
