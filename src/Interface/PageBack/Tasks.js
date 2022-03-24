import * as React from 'react';
import { Animated, FlatList } from 'react-native';
import { GestureResponderEvent, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import user from '../../Managers/UserManager';

import { TimingAnimation } from '../../Utils/Animations';
import { MinMax } from '../../Utils/Functions';

/**
 * @typedef {import('../../Class/Tasks').Task} Task
 * @typedef {import('../../Class/Admob').AdStates} AdStates
 * @typedef {import('../../Class/Admob').AdTypes['add10Ox']} AdEvent
 */

class BackTasks extends React.Component {
    state = {
        /** @type {AdStates} */
        adState: 'wait',
        tasks: user.tasks.Get(),

        scrollable: true,

        /** @type {Task?} */
        draggedItem: null,
        mouseY: new Animated.Value(0),
        top: 0,
        height: 0
    }

    constructor(props) {
        super(props);
        /** @type {FlatList<Task>} */
        this.refFlatlist = React.createRef();
        this.flatlist = {
            contentSizeHeight: 0,
            layoutMeasurementHeight: 0,
            contentOffsetY: 0,
        }
        this.rewardedShop = user.admob.GetRewardedAd('todo', 'add10Ox', this.adStateChange);
    }
    componentWillUnmount() {
        user.admob.ClearEvents('todo');
    }

    addTask = () => {
        user.interface.ChangePage('task', undefined, true);
    }
    onTaskCheck = () => {
        // TODO
    }

    /** @param {import('../../Class/Tasks').Task} item */
    onDrag = (item) => {
        this.setState({ scrollable: false, draggedItem: item });
    }
    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height, y } = event.nativeEvent.layout;
        // Header height + top padding + demi-height of selection
        const offset = 56 + 14 + 32/2;
        this.setState({ top: y + offset, height: height - offset });
    }
    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        const { top, height } = this.state;
        const { pageY } = event.nativeEvent;
        const newY = MinMax(0, pageY - top, height);
        TimingAnimation(this.state.mouseY, newY, 0).start();
    }
    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const { top, height, draggedItem } = this.state;
        const { pageY } = event.nativeEvent;
        const { contentOffsetY: scrollY, contentSizeHeight, layoutMeasurementHeight } = this.flatlist;
        const scrollYMax = contentSizeHeight - layoutMeasurementHeight;

        const newY = MinMax(0, pageY - top, height);
        TimingAnimation(this.state.mouseY, newY, 0).start();

        if (draggedItem !== null) {
            const index = Math.floor((newY + scrollY) / 46);
            const currIndex = user.tasks.sortTitles.indexOf(draggedItem.Title);
            if (index !== currIndex) {
                user.tasks.Move(draggedItem, index);
                this.setState({ tasks: user.tasks.Get() });
            }

            const scrollOffset = 48;
            if (newY < scrollOffset && scrollY > 0) {
                const newOffset = Math.max(0, scrollY - scrollOffset);
                this.refFlatlist?.scrollToOffset({ offset: newOffset, animated: true });
            } else if (newY > height - scrollOffset && scrollY < scrollYMax) {
                const newOffset = Math.min(scrollYMax, scrollY + scrollOffset);
                this.refFlatlist?.scrollToOffset({ offset: newOffset, animated: true });
            }
        }
    }
    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        this.setState({ scrollable: true, draggedItem: null });
    }
    /** @param {NativeSyntheticEvent<NativeScrollEvent>} event */
    onScroll = (event) => {
        this.flatlist.contentOffsetY = event.nativeEvent.contentOffset.y;
    }

    watchAd = () => {
        if (this.rewardedShop === null) {
            user.interface.console.AddLog('warn', 'Ad not created');
            return;
        }
        if (!this.rewardedShop.loaded) {
            user.interface.console.AddLog('warn', 'Ad not loaded');
            return;
        }

        this.rewardedShop.show();
    }

    /** @type {AdEvent} */
    adStateChange = (state) => this.setState({ adState: state });
}

export default BackTasks;