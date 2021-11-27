import * as React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';

import themeManager from '../../Managers/ThemeManager';
import { isUndefined } from '../../Functions/Functions';

const MAIN_FONT_NAME = 'Hind Vadodara';

const TextProps = {
    style: {},
    containerStyle: {},
    fontSize: 18,
    color: 'primary',
    onPress: undefined,
}

class Text extends React.Component {
    render() {
        const color = themeManager.getColor(this.props.color, 'text');
        const onPress = this.props.onPress;

        return (
            <TouchableOpacity
                style={this.props.containerStyle}
                onPress={onPress}
                activeOpacity={.5}
                disabled={isUndefined(onPress)}
            >
                <RNText
                    style={[
                        styles.text,
                        {
                            color: color,
                            fontSize: this.props.fontSize
                        },
                        this.props.style
                    ]}
                >
                    {this.props.children}
                </RNText>
            </TouchableOpacity>
        );
    }
}

Text.prototype.props = TextProps;
Text.defaultProps = TextProps;

const styles = StyleSheet.create({
    text: {
        margin: 0,
        padding: 0,
        textAlign: 'center',
        fontFamily: MAIN_FONT_NAME
    }
});

export default Text;
export { MAIN_FONT_NAME };