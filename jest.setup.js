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
    getSystemVersion: jest.fn(() => '14.4')
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

jest.mock('Utils/TCP', () => {
    return jest.fn().mockImplementation(() => ({
        Connect: jest.fn(() => Promise.resolve(true)),
        IsConnected: jest.fn(() => false),
        Disconnect: jest.fn(),
        Send: jest.fn(() => true),
        SendAndWait: jest.fn(() => Promise.resolve({ status: 'connect' })),
        WaitForAction: jest.fn(() => Promise.resolve({ status: 'connect' })),
        state: {
            Set: jest.fn(),
            Get: jest.fn(() => 'disconnected'),
            AddListener: jest.fn(() => 1),
            RemoveListener: jest.fn()
        }
    }));
});

jest.mock('Utils/DataStorage', () => ({
    Load: jest.fn(() => Promise.resolve({})),
    Save: jest.fn(() => Promise.resolve(true)),
    STORAGE: {
        LOGIN: 'LOGIN'
    }
}));
