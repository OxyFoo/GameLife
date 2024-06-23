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
 *
 * @typedef {object} UserHeaderPropsType
 * @property {StyleProp} style
 * @property {boolean} editorMode
 * @property {() => void} onPress
 */

/** @type {UserHeaderPropsType} */
const UserHeaderProps = {
    style: {},
    editorMode: false,
    onPress: () => {}
};

class UserHeaderBack extends React.Component {
    state = {
        height: 0,
        username: user.informations.username.Get(),
        titleText: user.informations.GetTitleText(),
        animPosY: new Animated.Value(-128),
        showAvatar: false
    };

    /** @type {boolean} */
    show = false;

    /** @type {React.RefObject<Button>} */
    refContainer = React.createRef();

    /** @type {React.RefObject<Frame>} */
    refFrame = React.createRef();

    /** @type {Symbol | null} */
    nameListener = null;

    /** @type {Symbol | null} */
    titleListener = null;

    /** @param {UserHeaderPropsType} props */
    constructor(props) {
        super(props);

        this.state.animPosY.setValue(props.editorMode ? -6 : -128);
    }

    componentDidMount() {
        this.nameListener = user.informations.username.AddListener(this.update);
        this.titleListener = user.informations.title.AddListener(this.update);
    }
    componentWillUnmount() {
        user.informations.username.RemoveListener(this.nameListener);
        user.informations.title.RemoveListener(this.titleListener);
    }

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

    ShowAvatar = (value = false) => this.setState({ showAvatar: value });

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ height });
    };
}

UserHeaderBack.prototype.props = UserHeaderProps;
UserHeaderBack.defaultProps = UserHeaderProps;

export default UserHeaderBack;
