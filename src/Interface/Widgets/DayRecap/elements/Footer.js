import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

import { Icon, Text } from 'Interface/Components';

// @ts-ignore
import GameLifeLogo from 'Ressources/logo/GameLife.png';

/**
 * @typedef {object} FooterProps
 * @property {string} [text]
 */

/**
 * Footer component for DayRecap
 * @param {FooterProps} props
 */
const Footer = ({ text = 'GameLife' }) => {
    return (
        <View style={styles.footer}>
            <View style={styles.footerLeft}>
                <Image source={GameLifeLogo} style={styles.footerLogo} />
                <Text style={styles.logoText} color='main1'>
                    {text}
                </Text>
            </View>
            <View style={styles.footerRight}>
                <Icon icon='apple' color='main1' size={16} />
                <Icon icon='android' color='main1' size={16} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    footerLogo: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    },
    footerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    logoText: {
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 1
    }
});

export default Footer;
