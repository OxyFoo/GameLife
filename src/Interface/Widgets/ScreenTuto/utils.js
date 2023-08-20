import { NativeModules, findNodeHandle } from 'react-native';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 */

/**
 * @param {View} ref
 * @returns {Promise<LayoutRectangle>}
 */
function GetAbsolutePosition(ref) {
    const UIManager = NativeModules.UIManager;
    const handle = findNodeHandle(ref);
    return new Promise((resolve, reject) => {
        UIManager.measureLayoutRelativeToParent(handle, reject, (x, y, width, height) => {
            resolve({ x, y, width, height });
        });
    });
}

export { GetAbsolutePosition };