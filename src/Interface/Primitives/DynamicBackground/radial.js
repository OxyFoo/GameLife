import { useState, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet } from 'react-native';

import themeManager from 'Managers/ThemeManager';
import { TimingAnimation } from 'Utils/Animations';
import { Defs, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 */

/**
 * @description Radial background for FlowEngine
 * @param {object} props
 * @param {ThemeColor} [props.color]
 * @param {number} [props.opacity] Between 0 and 1, default: 0.2
 * @param {{ width: number, height: number }} [props.size] Default: screen size
 * @param {{ x: number, y: number }[]} props.animPath
 * @param {number} [props.duration] Duration for each animation in ms
 * @returns {JSX.Element | null}
 */
const Radial = (props) => {
    const screenSize = Dimensions.get('window');

    const size = {
        width: screenSize.width,
        height: screenSize.height
    };

    const [animPos] = useState(new Animated.ValueXY({ x: 0, y: 0 }));

    useEffect(() => {
        if (props.animPath) {
            Animated.loop(
                Animated.sequence(
                    props.animPath.map((pos, i) =>
                        TimingAnimation(
                            animPos,
                            {
                                x: pos.x * size.width,
                                y: pos.y * size.height
                            },
                            i === 0 ? 0 : props.duration || 1000
                        )
                    )
                )
            ).start();
        }

        return () => {
            animPos.stopAnimation();
        };
    }, [animPos, props.animPath, props.duration, size.height, size.width]);

    if (!props.animPath || typeof props.animPath === 'undefined') {
        console.warn('Radial: animPath is not provided');
        return null;
    }

    const opacity = props.opacity ?? 0.2;
    const color = themeManager.GetColor(props?.color || 'main1');

    return (
        <Animated.View
            style={[
                styles.parent,
                {
                    transform: [
                        {
                            translateX: animPos.x
                        },
                        {
                            translateY: animPos.y
                        }
                    ]
                }
            ]}
        >
            <Svg
                style={{
                    width: size.width,
                    height: size.width,
                    transform: [{ translateX: -size.width / 2 }, { translateY: -size.width / 2 }, { scale: 3 }]
                }}
            >
                <Defs>
                    <RadialGradient id='grad'>
                        <Stop offset='0%' stopColor={color} stopOpacity={opacity} />
                        <Stop offset='100%' stopColor='transparent' stopOpacity='0' />
                    </RadialGradient>
                </Defs>
                <Rect x='0' y='0' width='100%' height='100%' fill='url(#grad)' />
            </Svg>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
    }
});

export { Radial };
