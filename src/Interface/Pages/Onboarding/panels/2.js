import * as React from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';

import { ONBOARDING_IMAGES as IMGS } from './images';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ImageStyle} ImageStyle
 */

const sentence = Math.random() > 0.5 ? 'second' : 'second-bis';

/**
 * @param {object} props
 * @param {number} props.index
 * @param {Animated.Value} props.anim
 * @param {() => void} [props.onNext]
 * @returns {JSX.Element}
 */
function RenderPage2({ index, anim, onNext }) {
    const lang = langManager.curr['onboarding'];

    const inputRange = [index - 1, index, index + 1];

    /** @type {Animated.WithAnimatedObject<ImageStyle> | undefined} */
    const styleAnimZap1 = {
        transform: [
            { scale: anim.interpolate({ inputRange, outputRange: [0.8, 1, 0.8] }) },
            { translateX: anim.interpolate({ inputRange, outputRange: [48, 0, -96] }) }
        ]
    };

    /** @type {Animated.WithAnimatedObject<ImageStyle> | undefined} */
    const styleAnimZap2 = {
        transform: [{ translateY: anim.interpolate({ inputRange, outputRange: [36, 0, -36] }) }]
    };

    /** @type {Animated.WithAnimatedObject<ImageStyle> | undefined} */
    const styleAnimZap1Ball = {
        transform: [
            { scale: anim.interpolate({ inputRange, outputRange: [0.8, 1.2, 1.4] }) },
            { rotate: anim.interpolate({ inputRange, outputRange: ['280deg', '360deg', '400deg'] }) },
            { translateX: anim.interpolate({ inputRange, outputRange: [0, 0, 48] }) },
            { translateY: anim.interpolate({ inputRange, outputRange: [24, 0, -24] }) }
        ]
    };

    /** @type {Animated.WithAnimatedObject<ImageStyle> | undefined} */
    const styleAnimZap1Level = {
        transform: [
            { scale: anim.interpolate({ inputRange, outputRange: [0.8, 1.2, 1.4] }) },
            { translateY: anim.interpolate({ inputRange, outputRange: [-24, 0, 24] }) }
        ]
    };

    /** @type {Animated.WithAnimatedObject<ImageStyle> | undefined} */
    const styleAnimZap2Level = {
        transform: [
            { scale: anim.interpolate({ inputRange, outputRange: [0.8, 1.2, 1.4] }) },
            { translateY: anim.interpolate({ inputRange, outputRange: [24, 0, -24] }) }
        ]
    };

    return (
        <View style={styles.parent}>
            {/** GameLife logo */}
            <View>
                <Image style={styles.imageHeader} source={IMGS.header.logo_gamelife} />
            </View>

            {/** Text 1 */}
            <View style={styles.text}>
                <Text>{lang['page2']['first']}</Text>
            </View>

            {/** Zaps */}
            <View style={styles.images}>
                <View style={styles.zap1}>
                    <Animated.Image
                        style={[styles.imageZap1Level, styleAnimZap1Level]}
                        source={IMGS.panel2.ZAP_1_LEVEL}
                    />
                    <Animated.Image style={[styles.imageZap1Ball, styleAnimZap1Ball]} source={IMGS.panel2.ZAP_1_BALL} />
                    <Animated.Image style={[styles.imageZap1, styleAnimZap1]} source={IMGS.panel2.ZAP_1} />
                </View>

                <View style={styles.zap2}>
                    <Animated.Image
                        style={[styles.imageZap2Level, styleAnimZap2Level]}
                        source={IMGS.panel2.ZAP_2_LEVEL}
                    />
                    <Animated.Image style={[styles.imageZap2, styleAnimZap2]} source={IMGS.panel2.ZAP_2} />
                </View>
            </View>

            {/** Text 2 */}
            <View style={styles.text}>
                <Text>{lang['page2'][sentence]}</Text>
            </View>

            {/** CTA */}
            <View style={styles.cta}>
                <Button style={styles.buttonNext} onPress={onNext}>
                    {lang['next']}
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        height: '100%',
        justifyContent: 'space-between'
    },
    text: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    images: {
        marginTop: -36,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    cta: {
        alignItems: 'center'
    },
    buttonNext: {
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 48
    },

    imageHeader: {
        marginTop: -48,
        marginBottom: -96,
        width: 'auto',
        resizeMode: 'contain'
    },

    zap1: {
        width: '30%',
        height: '100%'
    },
    imageZap1: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    imageZap1Level: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    imageZap1Ball: {
        width: '35%',
        height: 'auto',
        aspectRatio: 1,
        marginTop: -24,
        resizeMode: 'contain'
    },

    zap2: {
        width: '35%',
        height: '100%'
    },
    imageZap2: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    imageZap2Level: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        marginTop: -24,
        resizeMode: 'contain'
    }
});

export { RenderPage2 };
