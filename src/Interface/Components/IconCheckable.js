import * as React from 'react';
import { StyleSheet } from 'react-native';

import Icon from './Icon';
import Button from 'Interface/Components/Button';
import { IsUndefined } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Interface/Components/Icon').Icons} Icons
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 */

const IconCheckableProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {Icons} */
    icon: undefined,

    /** @type {string} Display an icon from XML base64 encoded */
    xml: undefined,

    /** @type {number} Size of the icon */
    size: 24,

    /** @type {ThemeColor | ThemeText} */
    colorOn: 'main1',

    /** @type {ThemeColor | ThemeText} */
    colorOff: 'backgroundGrey',

    /** @type {number} Used as ID parameter in "onPress" event */
    id: 0,

    /** @type {boolean} If true, icon is checked */
    checked: undefined,

    /**
     * @param {number} id
     * @param {boolean} checked
     */
    onPress: (id, checked) => {},

    /** @type {boolean} If true, icon is pressable */
    pressable: true
};

class IconCheckable extends React.Component {
    state = {
        checked: false
    }

    componentDidMount() {
        if (!IsUndefined(this.props.checked)) {
            this.setState({ checked: this.props.checked });
        }
    }

    componentDidUpdate(prevProps) {
        if (!IsUndefined(this.props.checked)) {
            if (this.props.checked !== this.state.checked) {
                this.setState({ checked: this.props.checked });
            }
        }
    }

    switch = () => {
        const { id, pressable, onPress } = this.props;
        const { checked } = this.state;

        if (pressable) {
            this.setState({ checked: !checked });
            onPress(id, !checked);
        }
    }

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

IconCheckable.prototype.props = IconCheckableProps;
IconCheckable.defaultProps = IconCheckableProps;

const styles = StyleSheet.create({
    box: {
        aspectRatio: 1
    }
});

export default IconCheckable;
