import * as React from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, View } from 'react-native';
import langManager from '../../Managers/LangManager';
import user from '../../Managers/UserManager';

import { OptionsAnimation } from '../Animations';
import GLText from './GLText';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PANEL_WIDTH = SCREEN_WIDTH / 2;

const SHORTCUTS = [
    { text: "shortcut-skills", event: () => { user.changePage('skills') } },
    { text: "shortcut-calendar", event: () => { user.changePage('calendar') } },
    { text: "shortcut-stats", event: () => { user.changePage('statistic') } },
    { text: "shortcut-level", event: () => { user.changePage('experience') } },
    { text: "shortcut-leaderboard", event: () => {} },
    { text: "shortcut-quests", event: () => {} },
    { text: "shortcut-settings", event: () => { user.changePage('settings') } }
];

class GLLeftPanel extends React.PureComponent {
    state = {
        opened: false,
        lastState: 0,
        animOpacity: new Animated.Value(0),
        animPosX: new Animated.Value(0)
    }

    componentDidUpdate() {
        const propsState = this.props.state;
        if (typeof(propsState) === 'boolean') {
            if (propsState !== this.state.lastState) {
                this.toggleVisibility();
            }
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
        const event = item.event;

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
        return (
            <Animated.View
                style={[styles.parent, { opacity: this.state.animOpacity }]}
                pointerEvents={this.state.opened !== null ? 'auto' : 'none'}
            >
                <View style={styles.background} onTouchStart={this.toggleVisibility} />
                <Animated.View style={[styles.container, {
                        transform: [{ translateX: this.state.animPosX }]
                    }]}
                >
                    <FlatList
                        data={SHORTCUTS}
                        keyExtractor={(item, i) => 'shortcut_' + i}
                        renderItem={this.shortcut}
                        ItemSeparatorComponent={this.separator}
                        ListHeaderComponent={this.separator}
                        ListFooterComponent={this.separator}
                    />
                </Animated.View>
            </Animated.View>
        )
    }
}

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
        paddingTop: 64,
        borderColor: '#FFFFFF',
        borderWidth: 2
    },
    component: {
        paddingHorizontal: 12,
        paddingVertical: 24
    },
    separator: {
        width: '60%',
        height: 2,
        marginLeft: '20%',
        backgroundColor: '#CCCCCC'
    }
});

export default GLLeftPanel;