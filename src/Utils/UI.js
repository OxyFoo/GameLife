/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 */

/**
 * @param {React.RefObject<View>} ref
 * @returns {Promise<LayoutRectangle>}
 */
function GetAbsolutePosition(ref) {
    return new Promise((resolve) => {
        if (ref.current === null) {
            resolve({ x: 0, y: 0, width: 0, height: 0 });
            return;
        }

        ref.current.measureInWindow((x, y, width, height) => {
            resolve({ x, y, width, height });
        });
    });
}

export { GetAbsolutePosition };
