import * as React from 'react';
import { Animated, View, Image, StyleSheet } from 'react-native';

import { ONBOARDING_IMAGES as IMGS } from './images';
import langManager from 'Managers/LangManager';

import { Button, Text } from 'Interface/Components';

/**
 * @typedef {import('react-native').ImageStyle} ImageStyle
 */

/**
 * @param {object} props
 * @param {number} props.index
 * @param {Animated.Value} props.anim
 * @param {() => void} [props.onNext]
 * @returns {JSX.Element}
 */
function RenderPage1({ index, anim, onNext }) {
    const lang = langManager.curr['onboarding'];

    const inputRange = [index - 1, index, index + 1];

    /** @type {Animated.WithAnimatedObject<ImageStyle> | undefined} */
    const styleAnimZapTriste = {
        transform: [
            { scale: anim.interpolate({ inputRange, outputRange: [0.8, 1, 0.8] }) },
            { translateX: anim.interpolate({ inputRange, outputRange: [48, 0, -96] }) }
        ]
    };

    /** @type {Animated.WithAnimatedObject<ImageStyle> | undefined} */
    const styleAnimZapCool = {
        transform: [{ translateY: anim.interpolate({ inputRange, outputRange: [36, 0, -36] }) }]
    };

    /** @type {Animated.WithAnimatedObject<ImageStyle> | undefined} */
    const styleAnimZapCoolCadres = {
        transform: [
            { scale: anim.interpolate({ inputRange, outputRange: [0.8, 1.2, 1.4] }) },
            { translateY: anim.interpolate({ inputRange, outputRange: [24, 0, -48] }) }
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
                <Text>{lang['page1']['first']}</Text>
            </View>

            {/** Zaps */}
            <View style={styles.images}>
                <Animated.Image style={[styles.imageZapTriste, styleAnimZapTriste]} source={IMGS.panel1.ZAP_TRISTE} />

                <View style={styles.zapCool}>
                    <Animated.Image
                        style={[styles.imageZapCoolCadres, styleAnimZapCoolCadres]}
                        source={IMGS.panel1.ZAP_COOL_CADRES}
                    />
                    <Animated.Image style={[styles.imageZapCool, styleAnimZapCool]} source={IMGS.panel1.ZAP_COOL} />
                </View>
            </View>

            {/** Text 2 */}
            <View style={styles.text}>
                <Text>{lang['page1']['second']}</Text>
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
    imageZapTriste: {
        width: '30%',
        height: 'auto',
        aspectRatio: 1,
        resizeMode: 'contain'
    },

    zapCool: {
        width: '30%',
        height: '100%'
    },
    imageZapCool: {
        width: '100%',
        height: 'auto',
        aspectRatio: 1,
        resizeMode: 'contain'
    },
    imageZapCoolCadres: {
        position: 'absolute',
        top: -72,
        left: 0,
        right: 0,
        bottom: 0,
        width: 'auto',
        height: 'auto',
        resizeMode: 'contain'
    }
});

export { RenderPage1 };
