import * as React from 'react';
import { View, StyleSheet, FlatList, Linking } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLHeader, GLIconButton, GLText } from '../Components/GL-Components';

class Leaderboard extends React.Component {
    state = {
        self: 0,
        leaderboard: []
    }
    constructor(props) {
        super(props);
        this.loadLoaderboard();
    }
    async loadLoaderboard() {
        const leaderboard = await user.conn.getLeaderboard();
        this.setState({
            self: leaderboard['self'],
            leaderboard: leaderboard['leaderboard']
        });
    }
    componentDidMount() {
        if (!user.conn.online) {
            const title = langManager.curr['leaderboard']['alert-onlineneed-title'];
            const text = langManager.curr['leaderboard']['alert-onlineneed-text'];
            user.openPopup('ok', [ title, text ]);
            setTimeout(user.backPage, 500);
        }
    }

    info = () => {
        const title = langManager.curr['leaderboard']['alert-connectneed-title'];
        const text = langManager.curr['leaderboard']['alert-connectneed-text'];
        user.openPopup('ok', [ title, text ]);
    }

    userBoard(props) {
        const self = props.self || false;
        const pseudo = props.pseudo + (self ? ' (' + langManager.curr['level']['me'] + ')' : '');
        const title = props.title;
        const xp = Math.ceil(props.xp) + ' ' + langManager.curr['level']['xp'];
        const pos = props.position;

        return (
            <View style={styles.userContainer}>
                <View style={styles.userImage}></View>
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
        const xp = item.XP + ' ' + langManager.curr['level']['xp'];

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

export default Leaderboard;