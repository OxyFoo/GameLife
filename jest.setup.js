import { Animated } from 'react-native';
import mockPermissions from 'react-native-permissions/mock';

jest.useFakeTimers();

// Mock UserManager with interface containing console
jest.mock('Managers/UserManager', () => ({
    __esModule: true,
    default: {
        interface: {
            console: {
                AddLog: jest.fn(() => 1),
                EditLog: jest.fn(),
                Enable: jest.fn(() => Promise.resolve())
            },
            size: {
                insets: { left: 0, top: 0, right: 0, bottom: 0 }
            },
            ChangePage: jest.fn(),
            ClearHistory: jest.fn()
        },
        settings: {
            IndependentSave: jest.fn(() => Promise.resolve(true)),
            musicLinks: {}
        },
        server2: {
            IsAuthenticated: jest.fn(() => false),
            tcp: {
                SendAndWait: jest.fn(() => Promise.resolve({ status: 'ok' }))
            }
        },
        onMount: jest.fn(),
        onUnmount: jest.fn(() => Promise.resolve()),
        SaveLocal: jest.fn(() => Promise.resolve(true)),
        SaveOnline: jest.fn(() => Promise.resolve(true)),
        LoadLocal: jest.fn(() => Promise.resolve(true)),
        Clear: jest.fn(() => Promise.resolve()),
        CLASS: [],
        DATA: []
    },
    UserManager: class {}
}));

// Mock react-native-worklets first (dependency of reanimated)
jest.mock('react-native-worklets', () => ({
    createWorkletRuntime: jest.fn(),
    runOnRuntime: jest.fn(),
    makeShareableCloneRecursive: jest.fn(),
    __workletHash: 0
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const React = require('react');
    const { View, Text } = require('react-native');

    const mockSharedValue = (initialValue) => ({
        value: initialValue,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        modify: jest.fn()
    });

    return {
        default: {
            createAnimatedComponent: (Component) => Component,
            View,
            Text,
            call: jest.fn()
        },
        useSharedValue: mockSharedValue,
        useAnimatedStyle: (fn) => fn(),
        withSpring: (value) => value,
        withTiming: (value) => value,
        withDelay: (delay, value) => value,
        withSequence: (...values) => values[0],
        withRepeat: (value) => value,
        runOnJS: (fn) => fn,
        runOnUI: (fn) => fn,
        Easing: {
            linear: jest.fn(),
            ease: jest.fn(),
            quad: jest.fn(),
            cubic: jest.fn(),
            poly: jest.fn(),
            sin: jest.fn(),
            circle: jest.fn(),
            exp: jest.fn(),
            elastic: jest.fn(),
            back: jest.fn(),
            bounce: jest.fn(),
            bezier: jest.fn(),
            in: jest.fn(),
            out: jest.fn(),
            inOut: jest.fn()
        },
        interpolate: jest.fn(),
        Extrapolation: {
            CLAMP: 'clamp',
            EXTEND: 'extend',
            IDENTITY: 'identity'
        },
        useAnimatedGestureHandler: jest.fn(),
        useAnimatedScrollHandler: jest.fn(),
        useAnimatedRef: () => ({ current: null }),
        useDerivedValue: (fn) => mockSharedValue(fn()),
        useAnimatedProps: (fn) => fn(),
        cancelAnimation: jest.fn(),
        measure: jest.fn(),
        scrollTo: jest.fn(),
        FadeIn: { duration: jest.fn(() => ({ delay: jest.fn() })) },
        FadeOut: { duration: jest.fn(() => ({ delay: jest.fn() })) },
        SlideInRight: { duration: jest.fn() },
        SlideOutLeft: { duration: jest.fn() },
        Layout: { duration: jest.fn() },
        LinearTransition: { duration: jest.fn() }
    };
});

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

jest.mock('react-native-view-shot', () => {
    const React = require('react');
    const { View } = require('react-native');
    const ViewShot = React.forwardRef((props, ref) => React.createElement(View, { ...props, ref }));
    ViewShot.captureRef = jest.fn(() => Promise.resolve('file:///mock.png'));
    ViewShot.captureScreen = jest.fn(() => Promise.resolve('file:///mock.png'));
    return {
        __esModule: true,
        default: ViewShot,
        captureRef: ViewShot.captureRef,
        captureScreen: ViewShot.captureScreen
    };
});

jest.mock('react-native-share', () => ({
    default: {
        open: jest.fn(() => Promise.resolve()),
        shareSingle: jest.fn(() => Promise.resolve())
    },
    Social: {}
}));

jest.mock('@react-native-camera-roll/camera-roll', () => ({
    CameraRoll: {
        saveAsset: jest.fn(() => Promise.resolve()),
        save: jest.fn(() => Promise.resolve()),
        getPhotos: jest.fn(() => Promise.resolve({ edges: [] }))
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

jest.mock('@oxyfoo/avatar-factory', () => ({
    AvatarCharacter: 'View',
    AvatarFrame: 'View',
    RenderingTechnology: 'Canvas',
    getRenderingTechnology: jest.fn(() => 'Canvas')
}));

jest.mock('react-native-iap', () => ({
    initConnection: jest.fn(() => Promise.resolve(true)),
    endConnection: jest.fn(() => Promise.resolve()),
    requestPurchase: jest.fn(() => Promise.resolve()),
    getProducts: jest.fn(() => Promise.resolve([])),
    getSubscriptions: jest.fn(() => Promise.resolve([])),
    getPurchaseHistory: jest.fn(() => Promise.resolve([])),
    getAvailablePurchases: jest.fn(() => Promise.resolve([])),
    finishTransaction: jest.fn(() => Promise.resolve()),
    purchaseUpdatedListener: jest.fn(() => ({ remove: jest.fn() })),
    purchaseErrorListener: jest.fn(() => ({ remove: jest.fn() })),
    clearTransactionIOS: jest.fn(() => Promise.resolve()),
    clearProductsIOS: jest.fn(() => Promise.resolve()),
    flushFailedPurchasesCachedAsPendingAndroid: jest.fn(() => Promise.resolve()),
    acknowledgePurchaseAndroid: jest.fn(() => Promise.resolve()),
    consumePurchaseAndroid: jest.fn(() => Promise.resolve()),
    isIosStorekit2: jest.fn(() => false)
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
