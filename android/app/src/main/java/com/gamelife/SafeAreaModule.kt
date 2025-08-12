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
            val navigationBarsInsets = insets.getInsets(WindowInsetsCompat.Type.navigationBars())
            val statusBarsInsets = insets.getInsets(WindowInsetsCompat.Type.statusBars())
            val displayCutoutInsets = insets.getInsets(WindowInsetsCompat.Type.displayCutout())

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
            
            // Specific insets - converted to dp
            val navigationBars: WritableMap = Arguments.createMap()
            navigationBars.putDouble("top", (navigationBarsInsets.top / density).toDouble())
            navigationBars.putDouble("left", (navigationBarsInsets.left / density).toDouble())
            navigationBars.putDouble("right", (navigationBarsInsets.right / density).toDouble())
            navigationBars.putDouble("bottom", (navigationBarsInsets.bottom / density).toDouble())
            result.putMap("navigationBars", navigationBars)
            
            val statusBars: WritableMap = Arguments.createMap()
            statusBars.putDouble("top", (statusBarsInsets.top / density).toDouble())
            statusBars.putDouble("left", (statusBarsInsets.left / density).toDouble())
            statusBars.putDouble("right", (statusBarsInsets.right / density).toDouble())
            statusBars.putDouble("bottom", (statusBarsInsets.bottom / density).toDouble())
            result.putMap("statusBars", statusBars)
            
            val displayCutout: WritableMap = Arguments.createMap()
            displayCutout.putDouble("top", (displayCutoutInsets.top / density).toDouble())
            displayCutout.putDouble("left", (displayCutoutInsets.left / density).toDouble())
            displayCutout.putDouble("right", (displayCutoutInsets.right / density).toDouble())
            displayCutout.putDouble("bottom", (displayCutoutInsets.bottom / density).toDouble())
            result.putMap("displayCutout", displayCutout)

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to get safe area insets: ${e.message}")
        }
    }
}
