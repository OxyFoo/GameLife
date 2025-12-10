import { useRef, useState, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';

import { FormatForSearch } from 'Utils/String';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 *
 * @typedef {import('react-native').FlatList} FlatList
 * @typedef {import('Managers/ThemeManager').ThemeColor} ThemeColor
 *
 * @typedef {object} ComboBoxItem
 * @property {number | string} key
 * @property {string} value
 *
 * @typedef {Object} ComboBoxPropsType
 * @property {StyleProp} [style]
 * @property {StyleProp} [inputStyle]
 * @property {number} [maxContentHeight]
 * @property {string} [title]
 * @property {ThemeColor} [activeColor]
 * @property {Array<ComboBoxItem>} [data]
 * @property {string} [selectedValue]
 * @property {boolean} [enableSearchBar]
 * @property {(item: ComboBoxItem | null) => void} [onSelect]
 * @property {boolean} [enabled]
 * @property {boolean} [hideChevron]
 */

/** @type {ComboBoxPropsType} */
const ComboBoxDefaultProps = {
    style: {},
    inputStyle: {},
    maxContentHeight: 256,
    title: 'Title',
    activeColor: 'main1',
    data: [],
    selectedValue: '',
    enableSearchBar: false,
    onSelect: () => {},
    enabled: true,
    hideChevron: false
};

/**
 * @param {ComboBoxPropsType} props
 */
const ComboBoxBack = (props) => {
    const {
        style,
        inputStyle,
        maxContentHeight,
        title,
        activeColor,
        data: propsData,
        selectedValue,
        enableSearchBar,
        onSelect,
        enabled,
        hideChevron
    } = { ...ComboBoxDefaultProps, ...props };

    /** @type {[LayoutRectangle, React.Dispatch<React.SetStateAction<LayoutRectangle>>]} */
    const [parent, setParent] = useState({
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });

    const [anim] = useState(new Animated.Value(0));
    const [data, setData] = useState(propsData);
    const [selectionMode, setSelectionMode] = useState(false);
    const [search, setSearch] = useState('');

    /** @type {React.RefObject<View | null>} */
    const refParent = useRef(null);

    /** @type {React.RefObject<FlatList | null>} */
    const refFlatlist = useRef(null);

    // Update data when props.data changes
    useEffect(() => {
        setData(propsData);
        setSearch('');
    }, [propsData]);

    const closeSelection = useCallback(() => {
        SpringAnimation(anim, 0).start();
        setSelectionMode(false);
    }, [anim]);

    const onPress = useCallback(() => {
        if (!enabled || refParent.current === null) {
            return;
        }

        if (selectionMode) {
            closeSelection();
            return;
        }

        // Scroll to top
        refFlatlist.current?.scrollToOffset({
            offset: 0,
            animated: false
        });

        // Open selection
        refParent.current?.measureInWindow((x, y, width, height) => {
            setParent({ x, y, width, height });
            setSelectionMode(true);
            SpringAnimation(anim, 1).start();
        });
    }, [enabled, selectionMode, closeSelection, anim]);

    const resetSelection = useCallback(() => {
        if (!enabled) {
            return;
        }
        onSelect?.(null);
        if (selectionMode) {
            closeSelection();
        }
    }, [enabled, onSelect, selectionMode, closeSelection]);

    const refreshSearch = useCallback(
        (text = '') => {
            const textLowerCase = FormatForSearch(text);
            setData(
                propsData?.filter((/** @type {ComboBoxItem} */ item) =>
                    FormatForSearch(item.value).includes(textLowerCase)
                )
            );
            setSearch(text);
        },
        [propsData]
    );

    /** @param {ComboBoxItem} item */
    const onItemPress = useCallback(
        (/** @type {ComboBoxItem} */ item) => {
            onSelect?.(item);
            closeSelection();
        },
        [onSelect, closeSelection]
    );

    return {
        // State
        parent,
        anim,
        data,
        selectionMode,
        search,

        // Refs
        refParent,
        refFlatlist,

        // Methods
        onPress,
        closeSelection,
        resetSelection,
        refreshSearch,
        onItemPress,

        // Props
        style,
        inputStyle,
        maxContentHeight,
        title,
        activeColor,
        selectedValue,
        enableSearchBar,
        enabled,
        hideChevron
    };
};

export default ComboBoxBack;
