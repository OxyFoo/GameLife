import { Animated } from 'react-native';
import mockPermissions from 'react-native-permissions/mock';

jest.useFakeTimers();

jest.mock('react-native-config', () => {
    return {
        ENV: 'dev',
        VPS_PROTOCOL: 'ws',
        VPS_HOST: '10.0.0.179',
        VPS_PORT: '8092'
    };
});

jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-device-info', () => ({
    getUniqueIdSync: jest.fn(() => 99),
    getDeviceNameSync: jest.fn(() => 'iPhone 12'),
    getSystemName: jest.fn(() => 'iOS'),
    getSystemVersion: jest.fn(() => '14.4'),
    getBundleId: jest.fn(() => 'com.gamelife.app'),
    default: {
        getUniqueIdSync: jest.fn(() => 99),
        getDeviceNameSync: jest.fn(() => 'iPhone 12'),
        getSystemName: jest.fn(() => 'iOS'),
        getSystemVersion: jest.fn(() => '14.4'),
        getBundleId: jest.fn(() => 'com.gamelife.app')
    }
}));

jest.mock('react-native-permissions', () => {
    return mockPermissions;
});

jest.mock('react-native-safe-area', () => {
    return null;
});

jest.mock('react-native-google-mobile-ads', () => ({
    TurboModuleRegistry: {
        getEnforcing: () => {
            return {
                initialize: jest.fn(),
                setRequestConfiguration: jest.fn(),
                openAdInspector: jest.fn(),
                openDebugMenu: jest.fn()
            };
        }
    }
}));

jest.mock('@notifee/react-native', () => {
    return {
        AndroidImportance: {
            DEFAULT: 'default'
        },
        AndroidVisibility: {
            PRIVATE: 'private'
        },
        requestPermission: jest.fn(),
        onBackgroundEvent: jest.fn(),
        onForegroundEvent: jest.fn(),
        getNotificationSettings: jest.fn(() => ({
            alert: true,
            badge: true,
            sound: true
        })),
        setNotificationCategories: jest.fn(),
        setNotificationChannel: jest.fn(),
        getInitialNotification: jest.fn(() => ({
            title: 'Test Notification',
            body: 'This is a test notification'
        }))
    };
});

jest.mock('react-native-gifted-charts', () => ({
    LineChart: 'View',
    BarChart: 'View',
    PieChart: 'View'
}));

jest.mock('react-native-safe-area', () => ({
    SafeAreaView: 'View'
}));

jest.mock('react-native-safe-area', () => ({
    getSafeAreaInsetsForRootView: () =>
        Promise.resolve({
            safeAreaInsets: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        })
}));

Animated.timing = () => ({
    start: () => jest.fn(),
    reset: () => jest.fn(),
    stop: () => jest.fn()
});
Animated.spring = () => ({
    start: () => jest.fn(),
    reset: () => jest.fn(),
    stop: () => jest.fn()
});

jest.mock('Class/Server/TCP', () => {
    return jest.fn().mockImplementation(() => ({
        Connect: jest.fn(() => Promise.resolve('connected')),
        IsConnected: jest.fn(() => true),
        Disconnect: jest.fn(),
        Send: jest.fn(() => true),
        SendAndWait: jest.fn(() => Promise.resolve({ status: 'connect' })),
        WaitForAction: jest.fn(() => Promise.resolve({ status: 'connect' })),
        state: {
            Set: jest.fn(),
            Get: jest.fn(() => 'connected'),
            AddListener: jest.fn(() => 1),
            RemoveListener: jest.fn()
        }
    }));
});

jest.mock('Utils/Storage', () => ({
    Load: jest.fn(() => Promise.resolve({})),
    Save: jest.fn(() => Promise.resolve(true)),
    STORAGE: {
        LOGIN: 'LOGIN'
    }
}));

jest.mock('react-native-app-control', () => ({
    default: {
        exitApp: jest.fn(),
        killApp: jest.fn(),
        restartApp: jest.fn(),
        getAppVersion: jest.fn(() => '1.0.0'),
        getBuildNumber: jest.fn(() => '1'),
        getBundleId: jest.fn(() => 'com.gamelife.app')
    }
}));

jest.mock('@react-native-google-signin/google-signin', () => ({
    GoogleSignin: {
        configure: jest.fn(),
        isSignedIn: jest.fn(() => Promise.resolve(false)),
        signIn: jest.fn(() =>
            Promise.resolve({
                user: {
                    id: 'test-user-id',
                    name: 'Test User',
                    email: 'test@example.com',
                    photo: 'https://example.com/photo.jpg'
                }
            })
        ),
        signOut: jest.fn(() => Promise.resolve()),
        revokeAccess: jest.fn(() => Promise.resolve()),
        getCurrentUser: jest.fn(() => Promise.resolve(null)),
        getTokens: jest.fn(() =>
            Promise.resolve({
                accessToken: 'test-access-token',
                idToken: 'test-id-token'
            })
        )
    },
    statusCodes: {
        SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
        IN_PROGRESS: 'IN_PROGRESS',
        PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE'
    }
}));

jest.mock('react-native-keychain', () => ({
    getGenericPassword: jest.fn(() => Promise.resolve(false)),
    setGenericPassword: jest.fn(() => Promise.resolve()),
    resetGenericPassword: jest.fn(() => Promise.resolve()),
    getGenericPasswordForOptions: jest.fn(() => Promise.resolve(false)),
    setGenericPasswordForOptions: jest.fn(() => Promise.resolve()),
    resetGenericPasswordForOptions: jest.fn(() => Promise.resolve()),
    SECURITY_LEVEL: {
        ANY: 'ANY',
        SECURE_SOFTWARE: 'SECURE_SOFTWARE',
        SECURE_HARDWARE: 'SECURE_HARDWARE'
    },
    ACCESSIBLE: {
        WHEN_UNLOCKED: 'WHEN_UNLOCKED',
        AFTER_FIRST_UNLOCK: 'AFTER_FIRST_UNLOCK',
        ALWAYS: 'ALWAYS',
        WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 'WHEN_PASSCODE_SET_THIS_DEVICE_ONLY',
        WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'WHEN_UNLOCKED_THIS_DEVICE_ONLY',
        AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY',
        ALWAYS_THIS_DEVICE_ONLY: 'ALWAYS_THIS_DEVICE_ONLY'
    }
}));
