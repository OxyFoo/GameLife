import { Animated } from 'react-native';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').Animated} Animated
 *
 * @typedef {import('./back').Transitions} Transitions
 * @typedef {import('./back').PageMemory<*>} PageMemory
 */

/**
 * @param {PageMemory} page
 * @param {Transitions} transition
 * @returns {Animated.AnimatedProps<ViewStyle>['transform']}
 */
function GetAnimationPage(page, transition) {
    return [
        // @ts-ignore
        ..._animation_open(page, transition),
        ..._animation_close(page)
    ];
}

/**
 * @param {PageMemory} page
 * @param {Transitions} transition
 * @returns {Animated.AnimatedProps<ViewStyle>['transform']}
 */
function _animation_open(page, transition) {
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
 * @returns {Animated.AnimatedProps<ViewStyle>['transform']}
 */
function _animation_close(page) {
    return [
        {
            scale: Animated.add(0.75, Animated.multiply(0.25, Animated.subtract(1, page.transitionEnd)))
        }
    ];
}

export { GetAnimationPage };
