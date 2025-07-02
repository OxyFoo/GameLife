import { NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

/**
 * Get device unique ID
 * @returns {string} Unique ID of the device
 */
function GetDeviceUniqueID() {
    return DeviceInfo.getUniqueIdSync();
}

/**
 * Get device identifiers
 * @returns {{ deviceName: string, OSName: string, OSVersion: string }} Device identifiers
 */
function GetDeviceInformations() {
    const deviceName = DeviceInfo.getDeviceNameSync();
    const OSName = DeviceInfo.getSystemName();
    const OSVersion = DeviceInfo.getSystemVersion();
    return { deviceName, OSName, OSVersion };
}

/**
 * Return the current battery level, or null if not available (emulator)
 * @returns {number | null}
 */
function GetBattery() {
    if (DeviceInfo.isEmulatorSync()) return null;
    return DeviceInfo.getBatteryLevelSync();
}

function GetLangRegionLocale() {
    let langRegionLocale = 'fr_FR';

    try {
        // Are these variables still supported?
        if (Platform.OS === 'android' && NativeModules.I18nManager.localeIdentifier) {
            langRegionLocale = NativeModules.I18nManager.localeIdentifier;
        } else if (Platform.OS === 'ios' && NativeModules.SettingsManager.settings.AppleLocale) {
            langRegionLocale = NativeModules.SettingsManager.settings.AppleLocale;
        }
    } catch (e) {}

    return langRegionLocale.split('_')[0];
}

export { GetDeviceUniqueID, GetDeviceInformations, GetBattery, GetLangRegionLocale };
