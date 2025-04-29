import React, { forwardRef, useImperativeHandle } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from 'react-native-reanimated';

import styles from './style';

/**
 * @typedef {import('./back').PageNames} PageNames
 * @typedef {import('./back').PageMemory<PageNames>} PageMemory
 * @typedef {import('./back').Transitions} Transitions
 * @typedef {import('react-native-reanimated').SharedValue<boolean>} SharedValueBool
 */

/**
 * @typedef {Object} PageWrapperProps
 * @property {Transitions} transition
 * @property {React.ReactNode} children
 */

/**
 * @typedef {Object} PageWrapperRef
 * @property {() => void} animateIn
 * @property {(cb?: () => void) => void} animateOut
 */

const PageWrapper = forwardRef(
    /** @param {PageWrapperProps} props @param {React.Ref<PageWrapperRef>} ref */
    ({ transition, children }, ref) => {
        const transitionStart = useSharedValue(0);
        const transitionEnd = useSharedValue(0);

        useImperativeHandle(ref, () => ({
            animateIn() {
                transitionStart.value = withSpring(1);
                transitionEnd.value = withTiming(0, { duration: 200 });
            },
            animateOut(cb) {
                transitionEnd.value = withTiming(1, { duration: 200 }, (finished) => {
                    if (finished && cb) {
                        runOnJS(cb)(); // Safe & UI-thread friendly
                        transitionStart.value = withTiming(0, { duration: 0 });
                    }
                });
            }
        }));

        const animatedStyle = useAnimatedStyle(() => {
            let transform = [];

            if (transition === 'fromLeft') {
                transform.push({ translateX: (1 - transitionStart.value) * -200 });
            } else if (transition === 'fromRight') {
                transform.push({ translateX: (1 - transitionStart.value) * 200 });
            } else if (transition === 'fromTop') {
                transform.push({ translateY: (1 - transitionStart.value) * -200 });
            } else if (transition === 'fromBottom') {
                transform.push({ translateY: (1 - transitionStart.value) * 200 });
            } else {
                transform.push({ scale: 0.75 + 0.25 * transitionStart.value });
            }

            transform.push({
                scale: 0.75 + 0.25 * (1 - transitionEnd.value)
            });

            return { transform, opacity: transitionStart.value };
        });

        return <Animated.View style={[styles.page, animatedStyle]}>{children}</Animated.View>;
    }
);

export default PageWrapper;
