import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { IsUndefined } from '../../Functions/Functions';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { GetAge } from '../../Functions/Time';
import { Text, Icon, Button } from '../Components';

const UserHeaderProps = {
    style: {},
    showAge: false,
    onPress: undefined
}

class UserHeader extends React.Component {
    onPress = () => {
        if (typeof(this.props.onPress) === 'function') {
            this.props.onPress();
        }
    }

    onAvatarPress = () => {
        user.interface.ChangePage('identity');
    }

    render() {
        const editable = !IsUndefined(this.props.onPress);
        const age = GetAge(user.birthTime);
        const showAge = age !== null && this.props.showAge;
        const activeOpacity = editable ? 0.6 : 1;

        const userTitle = user.GetTitle();
        const edit = <Icon icon='edit' color='border' />;
        const avatar = <Button style={styles.avatar} onPress={this.onAvatarPress} rippleColor='white' />;
        const rightItem = editable ? edit : avatar;

        return (
            <TouchableOpacity style={[styles.header, this.props.style]} onPress={this.onPress} activeOpacity={activeOpacity}>
                <View style={{ justifyContent: 'center', height: 84 }}>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username} color='primary'>{user.username}</Text>
                        {showAge && <Text style={styles.age} color='secondary'>{langManager.curr['identity']['value-age'].replace('{}', age)}</Text>}
                    </View>
                    {userTitle !== '' && <Text style={styles.title} color='secondary'>{userTitle}</Text>}
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
        /*position: 'absolute',
        top: '20%',
        right: 0,*/
        height: 48,
        aspectRatio: 1,
        borderRadius: 4,
        borderColor: 'white',
        borderWidth: 2
    }
});

export default UserHeader;