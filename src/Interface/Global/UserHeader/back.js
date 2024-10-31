import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 *
 * @typedef {import('Interface/Components').Frame} Frame
 * @typedef {import('Interface/Components').Button} Button
 * @typedef {import('Interface/Widgets').NotificationsInAppButton} NotificationsInAppButton
 *
 * @typedef {object} UserHeaderPropsType
 * @property {StyleProp} style
 */

/** @type {UserHeaderPropsType} */
const UserHeaderProps = {
    style: {}
};

class UserHeaderBack extends React.Component {
    state = {
        height: 0,
        username: user.informations.username.Get(),
        titleText: user.informations.GetTitleText(),
        animPosY: new Animated.Value(-128),
        showAvatar: false,
        connectedToServer: user.server2.IsAuthenticated()
    };

    /** @type {boolean} */
    show = false;

    /** @type {React.RefObject<Button>} */
    refContainer = React.createRef();

    /** @type {React.RefObject<Frame>} */
    refFrame = React.createRef();

    /** @type {React.RefObject<NotificationsInAppButton>} */
    refBellButton = React.createRef();

    /** @type {Symbol | null} */
    nameListener = null;

    /** @type {Symbol | null} */
    titleListener = null;

    /** @type {Symbol | null} */
    serverListener = null;

    componentDidMount() {
        this.nameListener = user.informations.username.AddListener(this.update);
        this.titleListener = user.informations.title.AddListener(this.update);
        this.serverListener = user.server2.tcp.state.AddListener(this.updateServerState);
    }
    componentWillUnmount() {
        user.informations.username.RemoveListener(this.nameListener);
        user.informations.title.RemoveListener(this.titleListener);
        user.server2.tcp.state.RemoveListener(this.serverListener);
    }
    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ height });
    };

    Show = () => {
        if (this.show) {
            return;
        }

        this.show = true;
        SpringAnimation(this.state.animPosY, 0).start();
    };

    Hide = () => {
        if (!this.show) {
            return;
        }

        this.show = false;
        SpringAnimation(this.state.animPosY, -128).start();
    };

    update = () => {
        this.setState({
            username: user.informations.username.Get(),
            titleText: user.informations.GetTitleText()
        });
    };

    updateServerState = () => {
        this.setState({ connectedToServer: user.server2.IsAuthenticated() });
    };

    ShowAvatar = (value = false) => this.setState({ showAvatar: value });
}

UserHeaderBack.prototype.props = UserHeaderProps;
UserHeaderBack.defaultProps = UserHeaderProps;

export default UserHeaderBack;
