import * as React from 'react';
import { View, Animated, TouchableHighlight, FlatList, StyleSheet } from 'react-native';
import { LayoutChangeEvent, GestureResponderEvent } from 'react-native';

import themeManager from '../../Managers/ThemeManager';

import { Separator, Text } from '../Components';
import { SpringAnimation, TimingAnimation } from '../../Utils/Animations';
import { Sleep } from '../../Utils/Functions';

const ScreenListProps = {
}

class ScreenList extends React.Component {
    constructor(props) {
        super(props);
        this.posY = 0;
        this.height = 0;
        this.inMove = false;
    }
    state = {
        opened: false,
        positionY: new Animated.Value(0),

        label: '',
        data: '',
        anim: new Animated.Value(0),
        callback: () => {}
    }

    /**
     * Open the screen list
     * @param {string} label 
     * @param {Array<object>} data List of data { id: 0, value: '' }
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
            await Sleep(100); // Wait layout
            this.posY = Math.max(-this.height, -300);
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
    }

    /** @param {LayoutChangeEvent} event */
    onLayoutPanel = (event) => {
        const { height } = event.nativeEvent.layout;
        this.height = height;
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        if (this.inMove) return;

        const { pageY } = event.nativeEvent;
        this.lastY = pageY;
        this.accY = 0;

        this.inMove = true;
        this.tickTime = Date.now();
    }

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        // Position
        const posY = event.nativeEvent.pageY;
        const deltaY = this.lastY - posY;

        // Acceleration
        const deltaTime = (Date.now() - this.tickTime) / 1000;
        this.accY = deltaY / deltaTime;
        this.tickTime = Date.now();

        // Update
        this.lastY = posY;
        this.posY -= deltaY;
        this.posY = Math.max(this.posY, -this.height);
        TimingAnimation(this.state.positionY, this.posY, 0.1).start();
    }

    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        this.posY -= this.accY * .25;
        this.posY = Math.max(this.posY, -this.height);
        SpringAnimation(this.state.positionY, this.posY).start();

        if (Math.abs(this.accY) < 2 || this.posY > -100) {
            this.Close();
        }

        this.inMove = false;
    }

    renderItem = ({ item }) => {
        const { id, value } = item;
        const onPress = () => {
            this.state.callback(id);
            this.Close();
        }
        return (
            <TouchableHighlight
                style={styles.item}
                onPress={onPress}
                underlayColor={themeManager.GetColor('backgroundTransparent')}
            >
                <Text style={styles.itemText}>{value}</Text>
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
            <Animated.View style={[styles.parent, opacity]} pointerEvents={event}>
                <View
                    style={styles.background}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                />
                <Animated.View
                    style={[styles.panel, styleBackground, stylePosition]}
                    onTouchStart={this.onTouchStart}
                    onTouchMove={this.onTouchMove}
                    onTouchEnd={this.onTouchEnd}
                    onLayout={this.onLayoutPanel}
                >
                    <Text style={styles.label}>{label}</Text>

                    <Separator.Horizontal style={{ marginLeft: '10%', width: '80%' }} />

                    <FlatList
                        data={data}
                        renderItem={this.renderItem}
                        keyExtractor={(item) => item.id}
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
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16
    }
});

export default ScreenList;