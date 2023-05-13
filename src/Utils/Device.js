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

/**
 * Return the current battery level, or null if not available (emulator)
 * @returns {number?}
 */
function GetBattery() {
    if (DeviceInfo.isEmulatorSync()) return null;
    return DeviceInfo.getBatteryLevelSync();
}

export { GetDeviceInformations, GetBattery };