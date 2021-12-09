import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import user from '../../Managers/UserManager';
import { Text } from '../Components';

const UserHeaderProps = {
    style: {}
}

class UserHeader extends React.Component {
    render() {
        return (
            <View style={[styles.header, this.props.style]}>
                <Text style={styles.username} color='primary'>{user.username}</Text>
                <Text style={styles.title} color='secondary'>{user.getTitle()}</Text>
            </View>
        );
    }
}

UserHeader.prototype.props = UserHeaderProps;
UserHeader.defaultProps = UserHeaderProps;

const styles = StyleSheet.create({
    header: {
        width: '100%',
        marginBottom: 24,
        elevation: 1000,
        zIndex: 1000
    },
    username: {
        marginTop: '5%',
        fontSize: 28,
        textAlign: 'left'
    },
    title: {
        marginTop: 8,
        fontSize: 24,
        textAlign: 'left'
    },
});

export default UserHeader;