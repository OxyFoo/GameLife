import * as React from 'react';
import { StyleSheet } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import Icon from './Icon';
import Button from './Button';
import { IsUndefined } from '../../Utils/Functions';

/**
 * @typedef {import('../../Managers/ThemeManager').ColorTheme} ColorTheme
 * @typedef {import('../../Managers/ThemeManager').ColorThemeText} ColorThemeText
 */

const IconCheckableProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {String} Display an icon from XML base64 encoded */
    xml: '',

    /** @type {Number} Size of the icon */
    size: 24,

    /** @type {ColorTheme|ColorThemeText} */
    colorOn: 'main1',

    /** @type {ColorTheme|ColorThemeText} */
    colorOff: 'backgroundGrey',

    /** @type {Number} Used as ID parameter in "onPress" event */
    id: 0,

    /** @type {Boolean} If true, icon is checked */
    checked: undefined,

    /**
     * @param {Number} id
     * @param {Boolean} checked
     */
    onPress: (id, checked) => {},

    /** @type {Boolean} If true, icon is pressable */
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

        const hexOn = themeManager.GetColor(colorOn);
        const hexOff = themeManager.GetColor(colorOff);
        const iconColor = this.state.checked ? hexOff : hexOn;
        const backgroundColor = this.state.checked ? hexOn : hexOff;

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