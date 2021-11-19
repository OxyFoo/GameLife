import * as React from 'react';
import { View, StyleSheet, FlatList, Image, Dimensions } from 'react-native';

import BackLeaderboard from '../back/leaderboard';
import { GLHeader, GLText } from '../Components';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

class Leaderboard extends BackLeaderboard {
    userBoard(props) {
        const self = props.self || false;
        const pseudo = props.pseudo + (self ? ' (' + langManager.curr['level']['me'] + ')' : '');
        const title = props.title;
        const xp = Math.ceil(props.xp) + ' ' + langManager.curr['level']['xp'];
        const pos = props.position;

        return (
            <View style={styles.userContainer}>
                <View style={styles.userImage}>
                    <Image style={{ width: '100%', height: '100%' }} source={require('../../../res/photos/default.jpg')} resizeMode="contain" />
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
        const title = dataManager.titles.getTitleByID(parseInt(item.Title));
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
        const buttonText = langManager.curr['leaderboard'][this.state.time === 'week' ? 'button-week-text' : 'button-global-text'];

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
                    {/*<View style={styles.center}>
                        <GLButton value={buttonText} onPress={this.toggle.bind(this)} />
                    </View>*/}

                    <this.userBoard
                        self={true}
                        pseudo={user.pseudo}
                        title={user.title === 0 ? '' : dataManager.titles.getTitleByID(user.title)}
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
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: "5%",
        paddingHorizontal: "10%"
    },
    center: {
        marginBottom: "5%",
        alignItems: 'center',
    },
    userContainer: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: ww * 8 / 1000,
        borderColor: '#FFFFFF',
        padding: "1.2%",
        
    },
    userImage: {
        width: ww * 17 / 100,
        height: ww * 17/ 100,
        borderWidth: ww * 8 / 1000,
        borderColor: '#FFFFFF',
        
    },
    userDetails: {
        flex: 1,
        paddingLeft: "3%",
        justifyContent: 'space-around', 
    },
    userDetail: {
        textAlign: 'left'
    },
    userCorner: {
        position: 'absolute',
        top: 0,
        right: 0,
        padding: "1%",
        
    }
});

export default Leaderboard;