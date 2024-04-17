import * as React from 'react';

import { IsUndefined } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Interface/OldComponents/Icon').Icons} Icons
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

class IconCheckableBack extends React.Component {
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
}

IconCheckableBack.prototype.props = IconCheckableProps;
IconCheckableBack.defaultProps = IconCheckableProps;

export default IconCheckableBack;
