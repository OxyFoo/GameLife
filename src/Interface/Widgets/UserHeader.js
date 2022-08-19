import * as React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import themeManager from '../../Managers/ThemeManager';

import { Text, Icon, Button, Frame } from '../Components';
import { SpringAnimation } from '../../Utils/Animations';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const UserHeaderProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {boolean} */
    editorMode: false,

    /** @type {function} */
    onPress: () => {},

    /** @type {boolean} Only if editorMode is disabled (default) */
    show: false
}

class UserHeader extends React.Component {
    state = {
        username: '',
        titleText: '',
        animPosY: null,
        showAvatar: false
    }

    constructor(props) {
        super(props);

        this.state = {
            username: user.informations.username.Get(),
            titleText: user.informations.GetTitleText(),
            animPosY: new Animated.Value(props.editorMode ? -6 : -128)
        }

        /** @type {Frame} */
        this.refFrame = React.createRef();
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

    renderInteraction = () => {
        const { editorMode } = this.props;
        const { showAvatar } = this.state;

        if (editorMode) {
            const icon = user.server.IsConnected() ? 'edit' : 'nowifi';
            return (
                <Icon icon={icon} color='border' />
            );
        }

        const openProfile = () => user.interface.ChangePage('profile');
        const frameSize = { x: 200, y: 0, width: 500, height: 450 };

        return (
            <Button
                style={styles.avatar}
                onPress={openProfile}
                rippleColor='white'
            >
                {showAvatar && (
                    <Frame
                        ref={ref => this.refFrame = ref}
                        characters={[ user.character ]}
                        size={frameSize}
                        delayTime={0}
                        loadingTime={0}
                        onlyTop={true}
                    />
                )}
            </Button>
        );
    }

    renderContent() {
        const { style, editorMode, onPress } = this.props;
        const { username, titleText } = this.state;

        let age = user.informations.GetAge();
        if (age !== null) {
            const ageText = langManager.curr['profile']['value-age'];
            age = ageText.replace('{}', age);
        }

        const activeOpacity = editorMode ? 0.6 : 1;

        return (
            <TouchableOpacity
                style={[styles.header, style]}
                onPress={onPress}
                activeOpacity={activeOpacity}
            >
                <View style={styles.content}>
                    <View style={styles.usernameContainer}>

                        <Text style={styles.username} color='primary'>
                            {username}
                        </Text>

                        {editorMode && age !== null && (
                            <Text style={styles.age} color='secondary'>
                                {age}
                            </Text>
                        )}
                    </View>

                    {titleText !== '' && (
                        <Text style={styles.title} color='secondary'>
                            {titleText}
                        </Text>
                    )}
                </View>

                {this.renderInteraction()}
            </TouchableOpacity>
        );
    }

    render() {
        const { editorMode } = this.props;
        const { animPosY } = this.state;

        if (editorMode) {
            return this.renderContent();
        }

        const background = [ themeManager.GetColor('ground1'), themeManager.GetColor('ground2') ];
        const animStyle = { transform: [{ translateY: animPosY }] };

        return (
            <Animated.View style={[animStyle, styles.absolute]}>
                <LinearGradient
                    style={[styles.absolute, styles.linear]}
                    colors={background}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />
                <View style={styles.container}>
                    {this.renderContent()}
                </View>
            </Animated.View>
        );
    }
}

UserHeader.prototype.props = UserHeaderProps;
UserHeader.defaultProps = UserHeaderProps;

const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden'
    },
    linear: {
        width: '100%',
        height: SCREEN_HEIGHT,
    },
    container: {
        padding: 32,
        paddingBottom: 0
    },

    header: {
        width: '100%',
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    content: {
        justifyContent: 'center',
        height: 84
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    username: {
        marginTop: 6,
        fontSize: 28,
        textAlign: 'left'
    },
    age: {
        marginLeft: 6,
        marginBottom: 2,
        fontSize: 20
    },
    title: {
        fontSize: 24,
        textAlign: 'left'
    },
    avatar: {
        height: 48,
        aspectRatio: 1,
        borderRadius: 4,
        borderColor: 'white',
        borderWidth: 2,
        paddingVertical: 0,
        paddingHorizontal: 0
    }
});

export default UserHeader;