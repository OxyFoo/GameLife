import * as React from 'react';
import { Animated, Dimensions, FlatList, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import langManager from '../../Managers/LangManager';
import user from '../../Managers/UserManager';

import { OptionsAnimation } from '../../Functions/Animations';
import GLIconButton from './GLIconButton';
import GLText from './GLText';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PANEL_WIDTH = SCREEN_WIDTH / 2;

const SHORTCUTS = [
    { text: "shortcut-shop", event: () => { user.changePage('shop') } },
    { text: "shortcut-identity", event: () => { user.changePage('identity') } },
    { text: "shortcut-skills", event: () => { user.changePage('skills') } },
    { text: "shortcut-dailyquest", event: () => { user.changePage('dailyquest') } },
    { text: "shortcut-calendar", event: () => { user.changePage('calendar') } },
    { text: "shortcut-stats", event: () => { user.changePage('statistic') } },
    { text: "shortcut-level", event: () => { user.changePage('experience') } },
    //{ text: "shortcut-leaderboard", event: () => { user.changePage('leaderboard'); } },
    { text: "shortcut-achievements", event: () => { user.changePage('achievements') } },
    { text: "shortcut-report", event: () => { user.changePage('report') } },
    { text: "shortcut-settings", event: () => { user.changePage('settings') } }
];

class GLLeftPanel extends React.PureComponent {
    state = {
        opened: false,
        lastState: false,
        animOpacity: new Animated.Value(0),
        animPosX: new Animated.Value(0)
    }

    componentDidUpdate() {
        const propsState = this.props.state;
        if (propsState !== this.state.lastState) {
            this.toggleVisibility();
        }
    }

    toggleVisibility = () => {
        const opened = !this.state.opened;
        this.setState({ opened: opened, lastState: this.props.state });
        if (opened) {
            // Open
            OptionsAnimation(this.state.animOpacity, 1, 250).start();
            OptionsAnimation(this.state.animPosX, PANEL_WIDTH, 250).start();
        } else {
            // Close
            OptionsAnimation(this.state.animOpacity, 0, 250).start();
            OptionsAnimation(this.state.animPosX, 0, 250).start();
        }
    }

    shortcut({ item }) {
        const text = langManager.curr['home'][item.text];
        const event = () => {
            this.toggleVisibility();
            item.event();
        }

        return (
            <GLText style={styles.component} title={text} onPress={event} />
        )
    }

    separator() {
        return (
            <View style={styles.separator} />
        )
    }

    render() {
        const backgroundColor = { backgroundColor: user.themeManager.colors['globalBackcomponent'] };

        return (
            <Animated.View
                style={[styles.parent, { opacity: this.state.animOpacity }]}
                pointerEvents={this.state.opened ? 'auto' : 'none'}
            >
                <View style={styles.background} onTouchStart={this.toggleVisibility}>
                    <GLIconButton icon="back" style={styles.backButton} />
                </View>
                <Animated.View style={[styles.container, backgroundColor, {
                        transform: [{ translateX: this.state.animPosX }]
                    }]}
                >
                    <FlatList
                        style={{ flexGrow: 0 }}
                        data={SHORTCUTS}
                        keyExtractor={(item, i) => 'shortcut_' + i}
                        renderItem={this.shortcut.bind(this)}
                        ItemSeparatorComponent={this.separator}
                        ListHeaderComponent={this.separator}
                        ListFooterComponent={this.separator}
                    />
                    <TouchableOpacity style={styles.aboutContainer} activeOpacity={.5} onPress={() => { this.toggleVisibility(); user.changePage('about'); }}>
                        <GLText style={styles.aboutText} title={langManager.curr['home']['shortcut-about']} />
                        <Image style={styles.aboutImage} source={require('../../../ressources/logo/loading_3.png')} width={32} height={32} style={{ transform: [{ scale: 2.5 }] }} />
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>
        )
    }
}

// juste pour avoir la taille de l'écran 
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        backgroundColor: '#000000EE'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#00000011'
    },
    container: {
        width: PANEL_WIDTH,
        height: '100%',
        marginLeft: -PANEL_WIDTH,
        paddingTop: '10%',//wh*4/100,
        paddingBottom : '15%', //wh*10/100 , 
        borderColor: '#FFFFFF',
        borderRightWidth: 2
    },
    component: {
        paddingHorizontal: '4%', // ww * 32 / 1000 ,
        paddingVertical: '8%' // wh * 24 /1000 
    },
    separator: {
        width: '60%',
        height: 2,
        marginLeft: '20%',
        backgroundColor: '#CCCCCC'
    },
    aboutContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: '10%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    aboutText: {
        fontSize: ww*6/100,
        textAlign: 'left'
    },
    aboutImage: {
    },
    backButton: {
        position: 'absolute',
        right: 42,
        bottom: 42
    }
});

export default GLLeftPanel;