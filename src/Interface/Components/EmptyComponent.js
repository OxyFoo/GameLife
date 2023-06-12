import * as React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleViewProp
 * 
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const NewComponentProps = {
    /** @type {StyleViewProp} */
    style: {}
}

class NewComponent extends React.Component {
    render() {
        return (
            <View>
            </View>
        );
    }
}

NewComponent.prototype.props = NewComponentProps;
NewComponent.defaultProps = NewComponentProps;

const styles = StyleSheet.create({
});

export default NewComponent;