import * as React from 'react';
import { Animated } from 'react-native';

import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('Interface/Components').Page} Page
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 * 
 * @typedef {object} ComboBoxItem
 * @property {number | string} key
 * @property {string} value
 */

const ComboBoxProps = {
    /** @type {StyleProp} */
    style: {},

    /** @type {number} */
    maxHeight: 256,

    /** @type {ThemeColor} */
    activeColor: 'main1',

    /** @type {string} */
    title: 'Title',

    /** @type {Array<ComboBoxItem>} */
    data: [],

    selectedValue: '',
    setSearchBar: false,

    /** @param {ComboBoxItem} item */
    onSelect: (item) => {},

    /** @type {boolean} If false press event disabled */
    enabled: true
};

class ComboBoxBack extends React.Component {
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

    /** @param {LayoutChangeEvent} event */
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

        // Scroll to top
        if (this.flatlistRef !== null) {
            this.flatlistRef.scrollToOffset({ offset: 0, animated: false });
        }

        // Open selection
        SpringAnimation(this.state.anim, 1).start();
        this.setState({ selectionMode: true });
    }
    closeSelection = () => {
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

    /** @param {ComboBoxItem} item */
    onItemPress = (item) => {
        const { key, value } = item;

        this.props.onSelect(item);
        this.setState({ selectedValue: value })
        this.closeSelection();
    }
}

ComboBoxBack.prototype.props = ComboBoxProps;
ComboBoxBack.defaultProps = ComboBoxProps;

export default ComboBoxBack;
