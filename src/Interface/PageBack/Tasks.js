import * as React from 'react';
import { Animated, FlatList } from 'react-native';
import { GestureResponderEvent, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

import { TimingAnimation, SpringAnimation } from '../../Utils/Animations';
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
        height: 0,

        animUndoY: new Animated.Value(56 + 48 + 12)
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
    }
    componentDidMount() {
        this.rewardedShop = user.admob.GetRewardedAd('todo', 'add10Ox', this.adStateChange);
    }
    componentWillUnmount() {
        user.admob.ClearEvents('todo');
    }

    addTask = () => {
        if (this.state.tasks.length >= 8) {
            const title = langManager.curr['tasks']['alert-taskslimit-title'];
            const text = langManager.curr['tasks']['alert-taskslimit-text'];
            user.interface.popup.Open('ok', [title, text]);
            return;
        }
        user.interface.ChangePage('task', undefined, true);
    }
    /** @param {Task} task */
    onTaskCheck = async (task) => {
        // Open undo button
        SpringAnimation(this.state.animUndoY, 0).start();
        this.undoTimeout = setTimeout(() => {
            // Close undo button after 10 seconds
            SpringAnimation(this.state.animUndoY, 56 + 48 + 12).start();
        }, 10 * 1000);

        await new Promise((resolve, reject) => {
            const success = user.tasks.Remove(task) === 'removed';
            if (success) this.setState({ tasks: [...user.tasks.Get()] }, resolve);
            else resolve();
        });
    }

    undo = () => {
        // Close undo button
        SpringAnimation(this.state.animUndoY, 56 + 48 + 12).start();
        clearTimeout(this.undoTimeout);

        user.tasks.Undo();
        this.setState({ tasks: [...user.tasks.Get()] });
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
                if (user.tasks.Move(draggedItem, index)) {
                    this.setState({ tasks: user.tasks.Get() });
                }
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

    watchAd = () => this.rewardedShop.show();

    /** @type {AdEvent} */
    adStateChange = (state) => this.setState({ adState: state });
}

export default BackTasks;