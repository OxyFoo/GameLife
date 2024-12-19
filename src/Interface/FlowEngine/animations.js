import { Animated } from 'react-native';

/**
 * @typedef {import('./back').Transitions} Transitions
 * @typedef {import('./back').PageMemory<*>} PageMemory
 */

/**
 * @param {PageMemory} page
 * @param {Transitions} transition
 */
function GetAnimationPageOpen(page, transition) {
    if (transition === 'fromLeft') {
        return [
            {
                translateX: Animated.multiply(-200, Animated.subtract(1, page.transitionStart))
            }
        ];
    } else if (transition === 'fromRight') {
        return [
            {
                translateX: Animated.multiply(200, Animated.subtract(1, page.transitionStart))
            }
        ];
    } else if (transition === 'fromTop') {
        return [
            {
                translateY: Animated.multiply(-200, Animated.subtract(1, page.transitionStart))
            }
        ];
    } else if (transition === 'fromBottom') {
        return [
            {
                translateY: Animated.multiply(200, Animated.subtract(1, page.transitionStart))
            }
        ];
    }

    // Default transition
    return [
        {
            scale: Animated.add(0.75, Animated.multiply(0.25, page.transitionStart))
        }
    ];
}

/**
 * @param {PageMemory} page
 */
function GetAnimationPageClose(page) {
    return [
        {
            scale: Animated.add(0.75, Animated.multiply(0.25, Animated.subtract(1, page.transitionEnd)))
        }
    ];
}

export { GetAnimationPageOpen, GetAnimationPageClose };
