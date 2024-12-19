import * as React from 'react';

import { IsUndefined } from 'Utils/Functions';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {import('Ressources/Icons').IconsName} Icons
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * @typedef {import('Managers/ThemeManager').ThemeText} ThemeText
 *
 * @typedef {Object} IconCheckablePropsType
 * @property {StyleProp} style
 * @property {Icons} [icon]
 * @property {string} [xml] Display an icon from XML base64 encoded
 * @property {number} size Size of the icon
 * @property {ThemeColor | ThemeText} colorOn
 * @property {ThemeColor | ThemeText} colorOff
 * @property {number} id Used as ID parameter in "onPress" event
 * @property {boolean} checked If true, icon is checked
 * @property {(id: number, checked: boolean) => void} onPress
 * @property {boolean} pressable If true, icon is pressable
 */

/** @type {IconCheckablePropsType} */
const IconCheckableProps = {
    style: {},
    icon: undefined,
    xml: undefined,
    size: 24,
    colorOn: 'main1',
    colorOff: 'backgroundGrey',
    id: 0,
    checked: false,
    onPress: () => {},
    pressable: true
};

class IconCheckableBack extends React.Component {
    state = {
        checked: false
    };

    componentDidMount() {
        if (!IsUndefined(this.props.checked)) {
            this.setState({ checked: this.props.checked });
        }
    }

    /** @param {IconCheckablePropsType} _prevProps */
    componentDidUpdate(_prevProps) {
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
    };
}

IconCheckableBack.prototype.props = IconCheckableProps;
IconCheckableBack.defaultProps = IconCheckableProps;

export default IconCheckableBack;
