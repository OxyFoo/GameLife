import * as React from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';

import Leaderboard from '../../Pages/leaderboard';
import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { GLHeader, GLText } from './Components/GL-Components';

class T0Leaderboard extends Leaderboard {
    userBoard(props) {
        const self = props.self || false;
        const pseudo = props.pseudo + (self ? ' (' + langManager.curr['level']['me'] + ')' : '');
        const title = props.title;
        const xp = Math.ceil(props.xp) + ' ' + langManager.curr['level']['xp'];
        const pos = props.position;

        return (
            <View style={styles.userContainer}>
                <View style={styles.userImage}>
                    <Image style={{ width: '100%', height: '100%' }} source={require('../../../ressources/photos/default.jpg')} resizeMode="contain" />
                </View>
                <View style={styles.userDetails}>
                    <GLText style={styles.userDetail} title={pseudo} />
                    <GLText style={styles.userDetail} title={title} />
                    <GLText style={styles.userDetail} title={xp} />
                    <GLText style={styles.userCorner} title={pos} />
                </View>
            </View>
        )
    }

    userComponent({ item, index }) {
        const pseudo = item.Username;
        const title = user.getTitleByID(parseInt(item.Title));
        const xp = item.XP;

        return (
            <this.userBoard
                pseudo={pseudo}
                title={title}
                xp={xp}
                position={index+1}
            />
        )
    }

    render() {
        const connected = user.isConnected();
        const rightIcon = !connected ? 'info' : undefined;

        return (
            <View style={{ flex: 1 }}>
                {/* Header */}
                <GLHeader
                    title={langManager.curr['leaderboard']['page-title']}
                    leftIcon="back"
                    onPressLeft={user.backPage}
                    rightIcon={rightIcon}
                    onPressRight={this.info}
                />

                {/* Content */}
                <View style={styles.container}>

                    <this.userBoard
                        self={true}
                        pseudo={user.pseudo}
                        title={user.title === 0 ? '' : user.getTitleByID(user.title)}
                        xp={user.xp}
                        position={this.state.self}
                    />

                    <FlatList
                        style={{ marginTop: 24 }}
                        data={this.state.leaderboard}
                        keyExtractor={(item, i) => 'userboard_' + i}
                        renderItem={this.userComponent.bind(this)}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 24,
        paddingHorizontal: 48
    },
    userContainer: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: 3,
        borderColor: '#FFFFFF',
        padding: 4
    },
    userImage: {
        width: 64,
        height: 64,
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    userDetails: {
        flex: 1,
        paddingLeft: 12,
        justifyContent: 'space-around'
    },
    userDetail: {
        textAlign: 'left'
    },
    userCorner: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: 2
    }
});

export { T0Leaderboard };