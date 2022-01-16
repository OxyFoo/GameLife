import * as React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import langManager from '../../Managers/LangManager';

import user from '../../Managers/UserManager';
import { Text, Icon, Input, Button } from '../Components';

const UserHeaderProps = {
    style: {},
    showAge: false,
    editable: false
}

class UserHeader extends React.Component {
    state = {
        input: user.username
    }

    onPress = () => {
        if (!this.props.editable) return;
        user.interface.popup.Open('custom', this.renderEdit, undefined, true);
    }

    onAvatarPress = () => {
        user.interface.ChangePage('identity');
    }

    // TODO - Terminer cette popup
    renderEdit = () => {
        return (
            <View>
                <Text>TEST</Text>
                <Input
                    label='PSEUDO'
                    text={this.state.input}
                    onChangeText={(text) => { this.setState({ input: text }) }}
                />
            </View>
        );
    }

    render() {
        const age = langManager.curr['identity']['value-age'].replace('{}', '18');
        const showAge = age !== null && this.props.showAge;
        const activeOpacity = this.props.editable ? 0.6 : 1;

        const edit = <Icon icon='edit' color='border' />;
        const avatar = <Button style={styles.avatar} onPress={this.onAvatarPress} rippleColor='white' />;
        const rightItem = this.props.editable ? edit : avatar;

        return (
            <TouchableOpacity style={[styles.header, this.props.style]} onPress={this.onPress} activeOpacity={activeOpacity}>
                <View>
                    <View style={styles.usernameContainer}>
                        <Text style={styles.username} color='primary'>{user.username}</Text>
                        {showAge && <Text style={styles.age} color='secondary'>{age}</Text>}
                    </View>
                    <Text style={styles.title} color='secondary'>{user.GetTitle()}</Text>
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
        justifyContent: 'space-between',
        elevation: 1000,
        zIndex: 1000
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
        position: 'absolute',
        top: '20%',
        right: 0,
        height: '60%',
        aspectRatio: 1,
        borderRadius: 4,
        borderColor: 'white',
        borderWidth: 2
    }
});

export default UserHeader;