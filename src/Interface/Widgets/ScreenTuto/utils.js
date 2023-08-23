import { NativeModules, findNodeHandle } from 'react-native';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 */

/**
 * @param {React.Component} ref
 * @returns {Promise<LayoutRectangle>}
 */
function GetAbsolutePosition(ref) {
    const UIManager = NativeModules.UIManager;
    const handle = findNodeHandle(ref);
    return new Promise((resolve, reject) => {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
            resolve({ x, y, width, height });
        });
    });
}

export { GetAbsolutePosition };