import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

/**
 * @typedef {import('./Icon').Icons} Icons
 * @typedef {import('../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const NewComponentProps = {
    /** @type {StyleProp<ViewStyle>} */
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