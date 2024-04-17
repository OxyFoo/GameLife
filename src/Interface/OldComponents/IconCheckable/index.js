import * as React from 'react';
import { StyleSheet } from 'react-native';

import IconCheckableBack from './back';

import Icon from '../Icon';
import Button from '../Button';

class IconCheckable extends IconCheckableBack {
    render() {
        const { style, colorOn, colorOff, xml, icon, size } = this.props;

        const iconColor = this.state.checked ? colorOff : colorOn;
        const backgroundColor = this.state.checked ? colorOn : colorOff;

        const padding = 6;
        const btnSize = size + padding*2;
        const buttonStyle = [
            styles.box,
            {
                height: btnSize,
                paddingVertical: padding,
                paddingHorizontal: padding
            },
            style
        ];

        return (
            <Button
                style={buttonStyle}
                color={backgroundColor}
                borderRadius={10}
                onPress={this.switch}
            >
                <Icon
                    xml={xml}
                    icon={icon}
                    color={iconColor}
                    size={size} 
                />
            </Button>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        aspectRatio: 1
    }
});

export default IconCheckable;
