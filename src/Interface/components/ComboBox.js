import * as React from 'react';
import { Animated, FlatList, StyleSheet, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { TimingAnimation } from '../../Functions/Animations';
import Button from './Button';

import Text from './Text';
import Icon from './Icon';
import Input from './Input';
import themeManager from '../../Managers/ThemeManager';

/**
 * TODO
 * Remove TEST
 * Traduction de "Search"
 */
const TEST = [{id: 0, value: 'Item 0'}, {id: 1, value: 'Item 1'}, {id: 2, value: 'Item 2'}, {id: 3, value: 'Item 3'}, {id: 4, value: 'Item 4'}];

const ComboBoxProps = {
    style: {},
    activeColor: 'main1',
    title: 'Title',
    /**
     * @type {Array<{id: 0, value: ''}>}
     */
    data: TEST,
    setSearchBar: true,
    onSelect: (item) => {}
}

class ComboBox extends React.Component {
    state = {
        parent: {
            width: 0,
            height: 0,
            x: 0, y: 0
        },
        anim: new Animated.Value(0),
        selectionMode: false,
        selectedValue: ''
    }

    onLayout = (event) => {
        const  { x: _x, y: _y, width: _width, height: _height } = this.state.parent;
        const  { x, y, width, height } = event.nativeEvent.layout;
        if (x !== _x || y !== _y || width !== _width || height !== _height) {
            const parent = { x: x, y: y, width: width, height: height };
            this.setState({ parent: parent });
        }
    }

    openSelection = () => {
        TimingAnimation(this.state.anim, 1, 200).start();
        this.setState({ selectionMode: true });
    }
    closeSelection = () => {
        TimingAnimation(this.state.anim, 0, 200).start();
        this.setState({ selectionMode: false });
    }
    resetSelection = () => {
        this.setState({ selectedValue: '' });
    }

    renderSearchBar = () => {
        return (
            <View style={styles.parentSearchBar}>
                <Input label={'Search'} />
            </View>
        )
    }

    renderItem = ({ item }) => {
        const { id, value } = item;
        const onPress = () => {
            this.props.onSelect(item);
            this.setState({ selectedValue: value })
            this.closeSelection();
        };
        return (
            <TouchableHighlight
                style={styles.item}
                onPress={onPress}
                underlayColor={themeManager.getColor('backgroundTransparent')}
            >
                <Text style={styles.itemText}>{value}</Text>
            </TouchableHighlight>
        )
    }

    render() {
        const  { x, y, width, height } = this.state.parent;
        const angle = this.state.anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
        const animValue = this.state.anim.interpolate({ inputRange: [0, 1], outputRange: [y+height+20, y+height] });
        const overlayPos = [styles.overlay, {
            width: width,
            opacity: this.state.anim,
            transform: [{ translateX: x }, { translateY: animValue }],
            backgroundColor: themeManager.getColor('backgroundGrey')
        }];

        return (
            <>
                <View style={[styles.parent, this.props.style]} onLayout={this.onLayout}>
                    <Input label={this.props.title} text={this.state.selectedValue} active={this.state.selectionMode} pointerEvents='none' />
                    <View style={styles.chevron}><Animated.View style={{ transform: [{ rotateX: angle }] }}>
                        <Icon icon='chevron' size={20} angle={-90} />
                    </Animated.View></View>
                    <Button style={styles.hoverButton} onPress={this.openSelection} onLongPress={this.resetSelection} rippleColor='white' />
                </View>

                {this.state.selectionMode && <View style={styles.overlayBackground} onTouchStart={this.closeSelection} />}

                <Animated.View style={overlayPos} pointerEvents={this.state.selectionMode ? 'auto': 'none'}>
                    <FlatList
                        ListHeaderComponent={this.renderSearchBar}
                        data={this.props.data}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => 'i-' + index}
                    />
                </Animated.View>
            </>
        );
    }
}

ComboBox.prototype.props = ComboBoxProps;
ComboBox.defaultProps = ComboBoxProps;

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 128,
        height: 256,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        zIndex: 1000,
        elevation: 1000
    },
    overlayBackground: {
        position: 'absolute',
        top: '-100%',
        left: '-100%',
        right: '-100%',
        bottom: '-100%',
        backgroundColor: '#00000055',
        zIndex: 900,
        elevation: 900
    },
    hoverButton: {
        position: 'absolute',
        width: 'auto',
        height: 'auto',
        top: 2,
        left: 2,
        right: 2,
        bottom: 2,
        borderRadius: 2
    },

    parent: {
        width: '100%'
    },
    chevron: {
        position: 'absolute',
        top: 0,
        right: 12,
        bottom: 0,
        justifyContent: 'center'
    },

    item: {
        padding: 12
    },
    itemText: {
        textAlign: 'left'
    },
    parentSearchBar: {
        padding: 8
    }
});

export default ComboBox;