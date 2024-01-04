import React from 'react';
import { Animated, FlatList } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { MinMax } from 'Utils/Functions';
import { GetAbsolutePosition } from 'Utils/UI';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticEvent
 * 
 * @typedef {import('Class/Quests/MyQuests').MyQuest} MyQuest
 */

class BackQuestsList extends React.Component {
    state = {
        quests: [],

        /** @type {boolean} Used to disable scroll when dragging a quest */
        scrollable: true,

        /** @type {MyQuest | null} Used to manage selected quest */
        draggedItem: null,

        mouseY: new Animated.Value(0)
    }

    constructor(props) {
        super(props);

        /** @type {FlatList<MyQuest> | null} Used to manage quest sorting */
        this.refFlatlist = null;
        this.refContainer = null;
        this.refAddQuest = null;

        this.flatlist = {
            contentSizeHeight: 0,
            layoutMeasurementHeight: 0,
            contentOffsetY: 0,
        }

        /** @type {LayoutRectangle | null} */
        this.tmpLayoutContainer = null;

        this.state.quests = user.quests.myquests.Get();
    }

    componentDidMount() {
        this.listenerQuest = user.quests.myquests.allQuests.AddListener(this.refreshQuests);
    }

    componentWillUnmount() {
        user.quests.myquests.allQuests.RemoveListener(this.listenerQuest);
    }

    refreshQuests = () => {
        this.setState({ quests: user.quests.myquests.Get() });
    }

    /** @param {MyQuest} item */
    keyExtractor = (item) => (
        'quest-' + item.title +
            JSON.stringify(item.skills) +
            JSON.stringify(item.schedule)
    )

    /**
     * Add a new quest to the list and open the quest page\
     * Max 10 quests
     */
    addQuest = () => {
        if (user.quests.myquests.IsMax()) {
            const title = langManager.curr['quests']['alert-questslimit-title'];
            const text = langManager.curr['quests']['alert-questslimit-text'];
            user.interface.popup.Open('ok', [title, text]);
            return;
        }
        user.interface.ChangePage('myquest', undefined, true);
    }

    /** @param {MyQuest} item */
    onDrag = (item) => {
        this.setState({
            scrollable: false,
            draggedItem: item
        });
    }

    /** @param {NativeSyntheticEvent} event */
    onScroll = (event) => {
        this.flatlist.contentOffsetY = event.nativeEvent.contentOffset.y;
    }

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        const { pageY } = event.nativeEvent;
        this.initialSort = [ ...user.quests.myquests.sort ];

        GetAbsolutePosition(this.refFlatlist).then(pos => {
            this.tmpLayoutContainer = pos;

            const posY = this.tmpLayoutContainer.y + 92 / 2;
            const newY = MinMax(0, pageY - posY, this.tmpLayoutContainer.height);
            TimingAnimation(this.state.mouseY, newY, 0).start();
        });
    }
    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const { draggedItem, scrollable } = this.state;
        const { pageY } = event.nativeEvent;
        const { contentOffsetY: scrollY, contentSizeHeight, layoutMeasurementHeight } = this.flatlist;

        if (!scrollable) {
            event.stopPropagation();
        }

        if (this.tmpLayoutContainer === null || draggedItem === null) {
            return;
        }

        const componentHeight = 92;

        // Move quest selection
        const posY = this.tmpLayoutContainer.y + componentHeight / 2;
        const newY = MinMax(0, pageY - posY, this.tmpLayoutContainer.height - componentHeight);
        TimingAnimation(this.state.mouseY, newY, 0).start();

        // Change quest order when dragging
        const index = Math.floor((newY + scrollY + componentHeight / 1.5) / componentHeight);
        const currIndex = user.quests.myquests.sort.indexOf(draggedItem.created);
        if (index !== currIndex && user.quests.myquests.Move(draggedItem, index)) {
            this.setState({ quests: user.quests.myquests.Get() });
        }

        // Scroll flatlist when dragging quest near top or bottom
        const scrollOffset = 48;
        const scrollYMax = contentSizeHeight - layoutMeasurementHeight;
        if (newY < scrollOffset && scrollY > 0) {
            const newOffset = Math.max(0, scrollY - scrollOffset);
            this.refFlatlist?.scrollToOffset({ offset: newOffset, animated: true });
        } else if (newY > this.tmpLayoutContainer.height - scrollOffset && scrollY < scrollYMax) {
            const newOffset = Math.min(scrollYMax, scrollY + scrollOffset);
            this.refFlatlist?.scrollToOffset({ offset: newOffset, animated: true });
        }
    }
    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        if (this.state.draggedItem === null) {
            return;
        }

        // Dragging ended & save new quests order
        this.setState({
            scrollable: true,
            draggedItem: null
        });

        // Save changes if quests order changed (and not just a quest check)
        if (this.initialSort.join() !== user.quests.myquests.sort.join() &&
            this.initialSort.length === user.quests.myquests.sort.length) {
                user.GlobalSave();
        }

        // Reset tmpLayoutContainer
        this.tmpLayoutContainer = null;
    }
}

export default BackQuestsList;
