import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import themeManager from '../../Managers/ThemeManager';

const ComboboxProps = {
    style: {},
    activeColor: 'main1'
}

class Combobox extends React.Component {
    render() {
        const hexActiveColor = themeManager.getColor(this.props.activeColor);
        const borders = { borderColor: hexActiveColor };
        return (
            <View style={[styles.parent, borders, this.props.style]}>
            </View>
        );
    }
}

Combobox.prototype.props = ComboboxProps;
Combobox.defaultProps = ComboboxProps;

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        borderRadius: 4,
        borderWidth: 1.6
    },
});

export default Combobox;