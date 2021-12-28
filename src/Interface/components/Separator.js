import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import themeManager from '../../Managers/ThemeManager';

class Separator {
    static Horizontal(props) {
        const background = { backgroundColor: themeManager.getColor('white') };
        return (
            <View style={[styles.horizontal, background, props.style]} />
        );
    }

    static Vertical(props) {
        const background = { backgroundColor: themeManager.getColor('white') };
        return (
            <View style={[styles.vertical, background, props.style]} />
        );
    }
}

const styles = StyleSheet.create({
    horizontal: { width: '100%', height: 1 },
    vertical: { width: 1, height: '100%' },
});

export default Separator;