import { NativeModules, findNodeHandle } from 'react-native';

/**
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 */

/**
 * @param {React.Component} ref
 * @returns {Promise<LayoutRectangle>}
 */
function GetAbsolutePosition(ref) {
    const UIManager = NativeModules.UIManager;
    const handle = findNodeHandle(ref);
    return new Promise((resolve) => {
        UIManager.measureInWindow(handle, (x = 0, y = 0, width = 0, height = 0) => {
            resolve({ x, y, width, height });
        });
    });
}

export { GetAbsolutePosition };
