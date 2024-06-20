import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';

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
 * @param {{ width: number, height: number }} [props.size] Default: screen size
 * @param {{ x: number, y: number }[]} props.animPath
 * @param {number} [props.duration] Duration for each animation in ms
 * @returns {JSX.Element | null}
 */
function RadialBackground(props) {
    const screenSize = Dimensions.get('window');

    const [size, setSize] = React.useState({
        width: screenSize.width,
        height: screenSize.height
    });
    const [animPos] = React.useState(new Animated.ValueXY({ x: 0, y: 0 }));

    React.useEffect(() => {
        const width = props.size?.width ?? screenSize.width;
        const height = props.size?.height ?? screenSize.height;
        if (width !== size.width || height !== size.height) {
            console.log({ w: size.width, h: size.height });
            setSize({ width, height });
        }
    }, [
        props.size,
        screenSize.height,
        screenSize.width,
        size.height,
        size.width
    ]);

    React.useEffect(() => {
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
    }, [animPos, size, props.animPath, props.duration]);

    if (!props.animPath || typeof props.animPath === 'undefined') {
        console.warn('RadialBackground: animPath is not provided');
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.parent,
                {
                    transform: [
                        { translateX: animPos.x },
                        { translateY: animPos.y }
                    ]
                }
            ]}
        >
            <View
                key={Math.random().toString()}
                onLayout={() => console.log('rerender')}
            />
            <Svg style={styles.radial}>
                <Defs>
                    <RadialGradient id='grad'>
                        <Stop
                            offset='0%'
                            stopColor={themeManager.GetColor(
                                props?.color || 'main1'
                            )}
                            stopOpacity='.2'
                        />
                        <Stop
                            offset='100%'
                            stopColor='transparent'
                            stopOpacity='0'
                        />
                    </RadialGradient>
                </Defs>
                <Rect
                    x='0'
                    y='0'
                    width={size.width}
                    height={size.width}
                    fill='url(#grad)'
                />
            </Svg>
        </Animated.View>
    );
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
    },
    radial: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        transform: [
            { translateX: -SCREEN_WIDTH / 2 },
            { translateY: -SCREEN_WIDTH / 2 },
            { scale: 3 }
        ]
    }
});

export { RadialBackground };
