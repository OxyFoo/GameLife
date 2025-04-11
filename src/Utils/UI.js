import SafeArea from 'react-native-safe-area';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 */

/**
 * @param {React.RefObject<View | null>} ref
 * @returns {Promise<LayoutRectangle>}
 */
async function GetAbsolutePosition(ref) {
    if (!ref.current || typeof ref.current.measureInWindow !== 'function') {
        return { x: 0, y: 0, width: 0, height: 0 };
    }

    /** @type {LayoutRectangle} */
    const absolutePosition = await new Promise((resolve) => {
        if (!ref.current) return resolve({ x: 0, y: 0, width: 0, height: 0 });

        ref.current.measureInWindow((x, y, width, height) =>
            resolve({
                x,
                y,
                width,
                height
            })
        );
    });

    const { safeAreaInsets } = await SafeArea.getSafeAreaInsetsForRootView();

    return {
        x: absolutePosition.x - safeAreaInsets.left,
        y: absolutePosition.y - safeAreaInsets.top,
        width: absolutePosition.width,
        height: absolutePosition.height
    };
}

export { GetAbsolutePosition };
