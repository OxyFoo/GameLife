jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-device-info', () => ({
    getUniqueIdSync: jest.fn(() => 99),
    getDeviceNameSync: jest.fn(() => 'iPhone 12'),
    getSystemName: jest.fn(() => 'iOS'),
    getSystemVersion: jest.fn(() => '14.4'),
}));

jest.mock('@react-native-firebase/admob', () => ({
    AdsConsent: jest.fn(),
    AdsConsentStatus: jest.fn(),
    FirebaseAdMobTypes: jest.fn(),
    InterstitialAd: jest.fn(),
    RewardedAd: jest.fn(),
    TestIds: jest.fn(),
}));

jest.mock('react-native-push-notification', () => ({
    channelExists: jest.fn(),
    createChannel: jest.fn(),
    deleteChannel: jest.fn(),
    cancelLocalNotification: jest.fn(),
    localNotificationSchedule: jest.fn(),
    cancelAllLocalNotification: jest.fn(),
    getScheduledLocalNotifications: jest.fn()
}));

jest.mock('@react-native-community/push-notification-ios', () => ({
    checkPermissions: jest.fn(),
    requestPermissions: jest.fn(),
    addNotificationRequest: jest.fn(),
    getPendingNotificationRequests: jest.fn(),
    removePendingNotificationRequests: jest.fn(),
    removeAllPendingNotificationRequests: jest.fn()
}));