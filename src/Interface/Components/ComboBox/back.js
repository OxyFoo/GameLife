import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';

import { FormatForSearch } from 'Utils/String';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * 
 * @typedef {import('react-native').FlatList} FlatList
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
    maxContentHeight: 256,

    /** @type {string} */
    title: 'Title',

    /** @type {ThemeColor} */
    activeColor: 'main1',

    /** @type {Array<ComboBoxItem>} */
    data: [],

    selectedValue: '',

    /** @type {boolean} */
    enableSearchBar: false,

    /** @param {ComboBoxItem | null} item */
    onSelect: (item) => {},

    /** @type {boolean} If false press event disabled */
    enabled: true
};

class ComboBoxBack extends React.Component {
    state = {
        parent: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },
        anim: new Animated.Value(0),

        data: this.props.data,
        selectionMode: false,
        search: ''
    }

    /** @type {React.RefObject<FlatList>} */
    flatlistRef = React.createRef();

    /**
     * @param {ComboBoxProps} nextProps
     * @param {ComboBoxBack['state']} nextState
     */
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.data != nextProps.data ||
            this.props.selectedValue != nextProps.selectedValue ||
            this.props.enabled != nextProps.enabled ||
            this.state.selectionMode != nextState.selectionMode ||
            this.state.search != nextState.search;
    }

    /** @param {ComboBoxProps} prevProps */
    componentDidUpdate(prevProps) {
        // Data changed, update data and reset search
        if (prevProps.data != this.props.data) {
            this.setState({
                data: this.props.data,
                search: ''
            });
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

    onPress = () => {
        if (!this.props.enabled) return;

        if (this.state.selectionMode) {
            this.closeSelection();
            return;
        }

        // Scroll to top
        this.flatlistRef.current?.scrollToOffset({ offset: 0, animated: false });

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
        if (this.state.selectionMode) {
            this.closeSelection();
        }
    }

    refreshSearch = (text = '') => {
        const textLowerCase = FormatForSearch(text);
        this.setState({
            data: this.props.data
                .filter(item => FormatForSearch(item.value).includes(textLowerCase)),
            search: text
        });
    }

    /** @param {ComboBoxItem} item */
    onItemPress = (item) => {
        this.props.onSelect(item);
        this.closeSelection();
    }

    EnablePageScroll = () => {
        user.interface.GetCurrentPage()?.refPage.current?.EnableScroll();
    }
    DisablePageScroll = () => {
        user.interface.GetCurrentPage()?.refPage.current?.DisableScroll();
    }    
}

ComboBoxBack.prototype.props = ComboBoxProps;
ComboBoxBack.defaultProps = ComboBoxProps;

export default ComboBoxBack;
