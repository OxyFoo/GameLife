import * as React from 'react';

import user from 'Managers/UserManager';

import { ProfileEditor } from '../Edit';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 *
 * @typedef {object} UserHeaderPropsType
 * @property {StyleProp} style
 */

/** @type {UserHeaderPropsType} */
const UserHeaderProps = {
    style: {}
};

class HeaderBack extends React.Component {
    state = {
        username: user.informations.username.Get(),
        titleText: user.informations.GetTitleText()
    };

    /** @type {Symbol | null} */
    nameListener = null;

    /** @type {Symbol | null} */
    titleListener = null;

    componentDidMount() {
        this.nameListener = user.informations.username.AddListener(this.update);
        this.titleListener = user.informations.title.AddListener(this.update);
    }
    componentWillUnmount() {
        user.informations.username.RemoveListener(this.nameListener);
        user.informations.title.RemoveListener(this.titleListener);
    }

    update = () => {
        this.setState({
            username: user.informations.username.Get(),
            titleText: user.informations.GetTitleText()
        });
    };

    openEditProfile = () => {
        user.interface.popup?.Open({
            content: ProfileEditor
        });
    };
    openSettings = () => {
        user.interface.ChangePage('settings');
    };
}

HeaderBack.prototype.props = UserHeaderProps;
HeaderBack.defaultProps = UserHeaderProps;

export default HeaderBack;
