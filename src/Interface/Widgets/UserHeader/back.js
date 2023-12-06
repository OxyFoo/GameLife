import * as React from 'react';
import { Animated  } from 'react-native';

import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * 
 * @typedef {import('Interface/Components').Frame} Frame
 * @typedef {import('Interface/Components').Button} Button
 */

const UserHeaderProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {boolean} */
    editorMode: false,

    /** @type {function} */
    onPress: () => {},

    /** @type {boolean} Only if editorMode is disabled (default) */
    show: false
};

class UserHeaderBack extends React.Component {
    state = {
        height: 0,
        username: user.informations.username.Get(),
        titleText: user.informations.GetTitleText(),
        animPosY: null,
        showAvatar: false
    }

    /** @type {Button | null} */
    refContainer = null;

    /** @type {Frame | null} */
    refFrame = null;

    /** @param {UserHeaderProps} props */
    constructor(props) {
        super(props);

        this.state.animPosY = new Animated.Value(props.editorMode ? -6 : -128);
    }

    componentDidMount() {
        this.nameListener = user.informations.username.AddListener(this.update);
        this.titleListener = user.informations.title.AddListener(this.update);
    }
    componentWillUnmount() {
        user.informations.username.RemoveListener(this.nameListener);
        user.informations.title.RemoveListener(this.titleListener);
    }

    componentDidUpdate(prevProps) {
        const { show } = this.props;
        if (show !== prevProps.show) {
            const toValue = show ? 0 : -128;
            SpringAnimation(this.state.animPosY, toValue).start();
        }
    }

    update = () => {
        this.setState({
            username: user.informations.username.Get(),
            titleText: user.informations.GetTitleText()
        });
    }

    ShowAvatar = (value = false) => this.setState({ showAvatar: value });

    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ height });
    }
}

UserHeaderBack.prototype.props = UserHeaderProps;
UserHeaderBack.defaultProps = UserHeaderProps;

export default UserHeaderBack;
