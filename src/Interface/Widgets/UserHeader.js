import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { Text, Icon, Button } from '../Components';
import { IsUndefined } from '../../Utils/Functions';

const UserHeaderProps = {
    /** @type {StyleProp<ViewStyle>} */
    style: {},

    /** @type {Boolean} */
    showAge: false,

    /** @type {Function?} */
    onPress: undefined
}

class UserHeader extends React.Component {
    state = {
        username: user.informations.username.Get(),
        titleText: user.informations.GetTitleText()
    }
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
    }

    onPress = () => {
        if (typeof(this.props.onPress) === 'function') {
            this.props.onPress();
        }
    }

    render() {
        const openIdentity = () => user.interface.ChangePage('identity');
        const editable = !IsUndefined(this.props.onPress);
        const age = user.informations.GetAge();
        const showAge = age !== null && this.props.showAge;
        const activeOpacity = editable ? 0.6 : 1;

        const edit = <Icon icon={user.server.IsConnected() ? 'edit' : 'nowifi'} color='border' />;
        const avatar = <Button style={styles.avatar} onPress={openIdentity} rippleColor='white' />;
        const rightItem = editable ? edit : avatar;

        return (
            <TouchableOpacity style={[styles.header, this.props.style]} onPress={this.onPress} activeOpacity={activeOpacity}>
                <View style={{ justifyContent: 'center', height: 84 }}>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username} color='primary'>{this.state.username}</Text>
                        {showAge && <Text style={styles.age} color='secondary'>{langManager.curr['identity']['value-age'].replace('{}', age)}</Text>}
                    </View>
                    {this.state.titleText !== '' && <Text style={styles.title} color='secondary'>{this.state.titleText}</Text>}
                </View>
                {rightItem}
            </TouchableOpacity>
        );
    }
}

UserHeader.prototype.props = UserHeaderProps;
UserHeader.defaultProps = UserHeaderProps;

const styles = StyleSheet.create({
    header: {
        width: '100%',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        borderWidth: 2
    }
});

export default UserHeader;