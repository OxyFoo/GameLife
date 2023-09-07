import * as React from 'react';
import { StyleSheet } from 'react-native';

import Icon from './Icon';
import { Button } from 'Interface/Components';
import { IsUndefined } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const IconCheckableProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {string} Display an icon from XML base64 encoded */
    xml: '',

    /** @type {number} Size of the icon */
    size: 24,

    /** @type {ColorTheme|ColorThemeText} */
    colorOn: 'main1',

    /** @type {ColorTheme|ColorThemeText} */
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
}

class IconCheckable extends React.Component {
    constructor(props) {
        super(props);

        this.rippleRef = React.createRef(); 
        this.state = { checked: false };
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
        const { style, colorOn, colorOff, xml, size } = this.props;

        const iconColor = this.state.checked ? colorOff : colorOn;
        const backgroundColor = this.state.checked ? colorOn : colorOff;

        const padding = 6;
        const btnSize = size + padding*2;
        const buttonStyle = [ styles.box, { height: btnSize, paddingVertical: padding, paddingHorizontal: padding }, style ];

        return (
            <>
                <Button
                    style={buttonStyle}
                    color={backgroundColor}
                    borderRadius={10}
                    onPress={this.switch}
                >
                    <Icon
                        xml={xml}
                        color={iconColor}
                        size={size} 
                    />
                </Button>
            </>
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