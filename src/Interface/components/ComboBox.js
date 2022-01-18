import * as React from 'react';
import { Animated, FlatList, StyleSheet, TouchableHighlight, View } from 'react-native';

import Text from './Text';
import Button from './Button';
import Icon from './Icon';
import Input from './Input';
import themeManager from '../../Managers/ThemeManager';
import langManager from '../../Managers/LangManager';
import { SpringAnimation } from '../../Functions/Animations';

const ComboBoxProps = {
    style: {},
    activeColor: 'main1',
    title: 'Title',
    /**
     * @type {Array<{id: 0, value: ''}>}
     */
    data: [],
    selectedValue: '',
    setSearchBar: false,
    onSelect: (item) => {},
    enabled: true,

    /**
     * @type {React.Ref}
     * @description Used to prevent scroll page when scrolling list
     */
    pageRef: null,
    ignoreWarning: false
}

class ComboBox extends React.Component {
    state = {
        parent: {
            width: 0,
            height: 0,
            x: 0, y: 0
        },
        anim: new Animated.Value(0),

        data: [],
        selectionMode: false,
        selectedValue: '',
        search: ''
    }

    componentDidMount() {
        this.flatlistRef = null;
        this.refreshSearch();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data != this.props.data) {
            this.refreshSearch();
        }
        if (this.state.selectedValue != this.props.selectedValue) {
            this.setState({ selectedValue: this.props.selectedValue });
        }
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
        if (!this.props.enabled) return;

        // Disable parent scroll
        if (this.props.pageRef !== null) {
            this.props.pageRef.DisableScroll();
        } else if (!this.props.ignoreWarning) {
            console.warn('ComboBox: pageRef is null');
        }

        // Scroll to top
        if (this.flatlistRef !== null) {
            this.flatlistRef.scrollToOffset({ offset: 0, animated: false });
        }

        // Open selection
        SpringAnimation(this.state.anim, 1).start();
        this.setState({ selectionMode: true });
    }
    closeSelection = () => {
        if (this.props.pageRef !== null) {
            this.props.pageRef.EnableScroll();
        }
        SpringAnimation(this.state.anim, 0).start();
        this.setState({ selectionMode: false });
    }
    resetSelection = () => {
        if (!this.props.enabled) return;
        this.props.onSelect(null);
        this.setState({ selectedValue: '' });
    }

    refreshSearch = (text = '') => {
        if (text.length > 0) {
            const newDate = this.props.data.filter(item => item.value.toLowerCase().includes(text.toLowerCase()));
            this.setState({ data: newDate, search: text });
        } else {
            this.setState({ data: this.props.data, search: text });
        }
    }

    renderSearchBar = () => (
        <View style={styles.parentSearchBar}>
            <Input
                label={langManager.curr['modal']['search']}
                text={this.state.search}
                onChangeText={this.refreshSearch}
            />
        </View>
    )

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
                underlayColor={themeManager.GetColor('backgroundTransparent')}
            >
                <Text style={styles.itemText}>{value}</Text>
            </TouchableHighlight>
        )
    }
    renderChevron = () => {
        const angle = this.state.anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });

        return this.props.enabled && (
            <View style={styles.chevron} pointerEvents='none'>
                <Animated.View style={{ transform: [{ rotateX: angle }] }}>
                    <Icon icon='chevron' size={20} angle={-90} />
                </Animated.View>
            </View>
        )
    }
    render() {
        const  { x, y, width, height } = this.state.parent;
        const animValue = this.state.anim.interpolate({ inputRange: [0, 1], outputRange: [y+height+20, y+height] });
        const overlayPos = [styles.overlay, {
            width: width,
            opacity: this.state.anim,
            transform: [{ translateX: x }, { translateY: animValue }],
            backgroundColor: themeManager.GetColor('backgroundGrey')
        }];
        const header = this.props.setSearchBar ? this.renderSearchBar : null;

        return (
            <>
                {/* Component (Input for selection, chevron and button for ripple + events) */}
                <View style={[styles.parent, this.props.style]} onLayout={this.onLayout}>
                    <Input label={this.props.title} text={this.state.selectedValue} active={this.state.selectionMode} pointerEvents='none' />
                    <this.renderChevron />
                    <Button style={styles.hoverButton} onPress={this.openSelection} onLongPress={this.resetSelection} rippleColor='white' />
                </View>

                {/* Overlay (black opacity + back event) */}
                {this.state.selectionMode && <View style={styles.overlayBackground} onTouchStart={this.closeSelection} />}

                {/* Content (flatlist with elements) */}
                <Animated.View style={overlayPos} pointerEvents={this.state.selectionMode ? 'auto': 'none'}>
                    <FlatList
                        ref={ref => this.flatlistRef = ref}
                        ListHeaderComponent={header}
                        data={this.state.data}
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
        maxHeight: 256,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        zIndex: 1000,
        elevation: 1000
    },
    overlayBackground: {
        position: 'absolute',
        top: '-1000%',
        left: '-1000%',
        right: '-1000%',
        bottom: '-1000%',
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
        borderRadius: 2,
        zIndex: 800,
        elevation: 800
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