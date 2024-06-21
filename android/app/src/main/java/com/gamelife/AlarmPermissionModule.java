package com.gamelife;

import android.app.Activity;
import android.app.AlarmManager;
import android.content.Context;
import android.os.Build;
import android.provider.Settings;
import android.content.Intent;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AlarmPermissionModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    AlarmPermissionModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @NonNull
    @Override
    public String getName() {
        return "AlarmPermission";
    }

    @ReactMethod
    public void requestExactAlarmPermission(Promise promise) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            AlarmManager alarmManager = (AlarmManager) reactContext.getSystemService(Context.ALARM_SERVICE);
            if (alarmManager.canScheduleExactAlarms()) {
                promise.resolve(true);
            } else {
                Activity activity = getCurrentActivity();
                if (activity != null) {
                    Intent intent = new Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM);
                    activity.startActivityForResult(intent, 0);
                    promise.resolve(false);
                } else {
                    promise.reject("Activity is null");
                }
            }
        } else {
            promise.resolve(true); // Permission not required for older versions
        }
    }
}
