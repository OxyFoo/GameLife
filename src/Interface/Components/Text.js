import * as React from 'react';
import { StyleSheet, Text as RNText, TouchableOpacity } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import { IsUndefined } from '../../Functions/Functions';

const MAIN_FONT_NAME = 'Hind Vadodara';

const TextProps = {
    style: {},
    bold: undefined,
    containerStyle: {},
    fontSize: 18,
    color: 'primary',
    onPress: undefined,
    onLayout: undefined
}

class Text extends React.Component {
    render() {
        const onPress = this.props.onPress;
        let color = themeManager.GetColor(this.props.color, 'text');
        if (color === null) {
            color = themeManager.GetColor(this.props.color);
        }

        return (
            <TouchableOpacity
                style={this.props.containerStyle}
                onPress={onPress}
                activeOpacity={.5}
                disabled={IsUndefined(onPress)}
            >
                <RNText
                    style={[
                        styles.text,
                        {
                            color: color,
                            fontSize: this.props.fontSize,
                            fontWeight: IsUndefined(this.props.bold) ? 'normal' : 'bold'
                        },
                        this.props.style
                    ]}
                    onLayout={this.props.onLayout}
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