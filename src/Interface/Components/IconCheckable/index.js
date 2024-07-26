import * as React from 'react';
import { StyleSheet } from 'react-native';

import IconCheckableBack from './back';

import { Icon } from '../Icon';
import { Button } from '../Button';

class IconCheckable extends IconCheckableBack {
    render() {
        const { checked } = this.state;
        const { style, colorOn, colorOff, xml, icon, size } = this.props;

        const iconColor = this.state.checked ? colorOff : colorOn;
        const backgroundColor = this.state.checked ? colorOn : colorOff;

        return (
            <Button
                style={[styles.box, style]}
                appearance={checked ? 'uniform' : 'outline'}
                color={backgroundColor}
                fontColor={colorOn}
                borderColor={colorOn}
                onPress={this.switch}
            >
                <Icon xml={xml} icon={icon} color={iconColor} size={size} />
            </Button>
        );
    }
}

const styles = StyleSheet.create({
    box: {
        width: 'auto'
    }
});

export { IconCheckable };
