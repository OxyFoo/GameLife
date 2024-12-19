import crypto from 'crypto-js';
import { NativeModules, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

/**
 * Get device informations
 * @param {boolean} OS True to get the name and the version of the OS
 * @param {boolean} version True to get the version of the app
 * @returns Dictionary of currect device
 */
function GetDeviceInformations(OS = false, version = false) {
    let device = {};

    device.deviceID = DeviceInfo.getUniqueIdSync();
    device.deviceName = DeviceInfo.getDeviceNameSync();

    if (OS) {
        device.deviceOSName = DeviceInfo.getSystemName();
        device.deviceOSVersion = DeviceInfo.getSystemVersion();
    }
    if (version) {
        const appVersion = require('../../package.json').version;
        device.version = appVersion;
    }

    return device;
}

function GetDeviceIdentifiers() {
    const constKey = 'GameLifeIsBestAppToLiveBestLife';
    const deviceID = DeviceInfo.getUniqueIdSync();
    const deviceName = DeviceInfo.getDeviceNameSync();
    const OSName = DeviceInfo.getSystemName();
    const OSVersion = DeviceInfo.getSystemVersion();

    const text = `${deviceID}-${OSName}-${OSVersion}-${constKey}`;
    const identifier = crypto.SHA256(text).toString();
    return { identifier, deviceName, OSName, OSVersion };
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

export { GetDeviceInformations, GetDeviceIdentifiers, GetBattery, GetLangRegionLocale };
