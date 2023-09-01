import * as React from 'react';
import { View, Animated, TouchableHighlight, FlatList, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import themeManager from 'Managers/ThemeManager';

import { Separator, Text } from 'Interface/Components';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';
import { Sleep } from 'Utils/Functions';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * 
 * @typedef {object} ScreenListItem
 * @property {number} id
 * @property {string} value
 */

const ScreenListProps = {
}

class ScreenList extends React.Component {
    posY = 0;
    isPressed = false;
    inScroll = false;
    inScrollTimeout = null;

    heightPanel = 0;
    heightFlatlist = 0;
    heightFlatlistContent = 0;

    flatlistListener = null;

    /** @type {FlatList} */
    refFlatlist = null;

    state = {
        opened: false,
        positionY: new Animated.Value(0),
        positionFlatlistY: new Animated.Value(0),

        label: '',
        /** @type {Array<ScreenListItem>} */
        data: [],
        anim: new Animated.Value(0),
        callback: (id) => {}
    }

    componentDidMount() {
        this.flatlistListener = this.state.positionFlatlistY.addListener(({ value }) => {
            this.refFlatlist.scrollToOffset({ offset: value, animated: false });
        });
    }

    componentWillUnmount() {
        this.state.positionY.removeListener(this.flatlistListener);
    }

    /**
     * Open the screen list
     * @param {string} label 
     * @param {Array<ScreenListItem>} data
     * @param {(id: number) => void} callback (id) => {}
     */
    Open = (label = 'Input', data = [], callback = (id) => {}) => {
        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState({
            opened: true,
            label: label,
            data: data,
            callback: callback
        }, async () => {
            await Sleep(200); // Wait layout
            this.posY = Math.max(-this.heightPanel, -400);
            SpringAnimation(this.state.positionY, this.posY).start();
        });
    }

    /**
     * Close the screen list
     */
    Close = () => {
        TimingAnimation(this.state.anim, 0, 200).start();
        this.setState({
            opened: false,
            callback: () => {}
        });

        this.posY = 0;
        SpringAnimation(this.state.positionY, this.posY).start();
        SpringAnimation(this.state.positionFlatlistY, this.posY).start();
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutPanel = (event) => {
        const { height } = event.nativeEvent.layout;
        this.heightPanel = height;
    }

    onLayoutFlatList = (event) => {
        const { height } = event.nativeEvent.layout;
        this.heightFlatlist = height;
    }

    onContentSizeChange = (width, height) => {
        this.heightFlatlistContent = height;
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        if (this.isPressed) return;

        const { pageY } = event.nativeEvent;
        this.lastY = pageY;
        this.accY = 0;

        this.isPressed = true;
        this.tickTime = Date.now();
    }

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        // Position
        const { pageY } = event.nativeEvent;
        const { heightFlatlistContent, heightPanel, heightFlatlist } = this;
        const deltaY = this.lastY - pageY;
        const maxScreenY = user.interface.screenHeight * .8;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.accY = deltaY / deltaTime;
        this.tickTime = Date.now();

        // Avoid press when scrolling
        this.inScroll = true;
        clearTimeout(this.inScrollTimeout);

        // Update
        let maxScrollY = heightPanel;
        if (heightFlatlistContent > heightFlatlist) {
            maxScrollY = heightFlatlistContent - (heightPanel - heightFlatlist - 18);
        }
        this.lastY = pageY;
        this.posY -= deltaY;
        this.posY = Math.max(this.posY, -maxScrollY);

        // Animation
        TimingAnimation(this.state.positionY, Math.min(Math.max(this.posY, -heightPanel), maxScreenY), 0.1).start();
        TimingAnimation(this.state.positionFlatlistY, -this.posY - user.interface.screenHeight * 2 / 3, 0.1).start();
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (this.posY < -this.heightPanel && this.posY - this.accY * .25 > -this.heightPanel) {
            this.posY = -this.heightPanel + user.interface.screenHeight * .15;
        } else {
            this.posY -= this.accY * .25;
        }

        SpringAnimation(this.state.positionY, Math.max(this.posY, -this.heightPanel)).start();
        SpringAnimation(this.state.positionFlatlistY, -this.posY - user.interface.screenHeight * 2 / 3).start();

        if (this.posY > -100) {
            this.Close();
        }

        this.isPressed = false;
        this.inScrollTimeout = setTimeout(() => this.inScroll = false, 200);
    }

    renderItem = ({ item }) => {
        const { id, value } = item;
        const onPress = () => {
            if (this.inScroll) return;
            this.state.callback(id);
            this.Close();
        }
        return (
            <TouchableHighlight
                style={styles.item}
                onPress={onPress}
                underlayColor={themeManager.GetColor('backgroundTransparent')}
            >
                <Text>{value}</Text>
            </TouchableHighlight>
        );
    }

    render() {
        const { opened, anim, label, data } = this.state;
        const opacity = { opacity: anim };
        const event = opened ? 'auto' : 'none';
        const stylePosition = { transform: [{ translateY: this.state.positionY }] };
        const styleBackground = { backgroundColor: themeManager.GetColor('backgroundCard') };

        return (
            <Animated.View
                style={[styles.parent, opacity]}
                pointerEvents={event}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
            >
                <View style={styles.background} />

                <Animated.View
                    style={[styles.panel, styleBackground, stylePosition]}
                    onLayout={this.onLayoutPanel}
                >
                    <View style={[styles.background2, styleBackground]} />
                    <Text style={styles.label}>{label}</Text>

                    <Separator.Horizontal style={{ marginLeft: '10%', width: '80%' }} />

                    <FlatList
                        ref={ref => this.refFlatlist = ref}
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => 'SL-' + item.id + '-' + item.value}
                        onLayout={this.onLayoutFlatList}
                        onContentSizeChange={this.onContentSizeChange}
                        initialNumToRender={data.length / 2}
                        scrollEnabled={false}
                    />
                </Animated.View>
            </Animated.View>
        );
    }
}

ScreenList.prototype.props = ScreenListProps;
ScreenList.defaultProps = ScreenListProps;

const styles = StyleSheet.create({
    parent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: .8,
        backgroundColor: '#000000'
    },
    background2: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        height: 24
    },

    item: {
        padding: 12
    },

    label: {
        fontSize: 28,
        paddingVertical: 12
    },
    panel: {
        top: '100%',
        width: '100%',
        maxHeight: '80%',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    }
});

export default ScreenList;