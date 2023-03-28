import * as React from 'react';
import { Animated, FlatList } from 'react-native';
import { GestureResponderEvent, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';
import langManager from '../../../Managers/LangManager';

import { TimingAnimation, SpringAnimation } from '../../../Utils/Animations';
import { MinMax } from '../../../Utils/Functions';
import { GetTime } from '../../../Utils/Time';

/**
 * @typedef {import('../../../Class/Tasks').Task} Task
 */

class BackTasks extends PageBack {
    state = {
        tasks: [],

        scrollable: true,

        /** @type {Task|null} */
        draggedItem: null,
        mouseY: new Animated.Value(0),
        top: 0,
        height: 0,

        animUndoY: new Animated.Value(56 + 48 + 12)
    }

    constructor(props) {
        super(props);

        /** @type {FlatList<Task>} Used to manage task sorting */
        this.refFlatlist = React.createRef();

        this.flatlist = {
            contentSizeHeight: 0,
            layoutMeasurementHeight: 0,
            contentOffsetY: 0,
        }

        user.tasks.RefreshScheduleTasks();
        this.state.tasks = user.tasks.Get();
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
        // If task is scheduled, check/uncheck it
        if (task.Schedule.Type !== 'none') {
            const checked = task.Checked !== 0 ? 0 : GetTime();
            user.tasks.Check(task, checked);
            this.forceUpdate();
        }

        // If task is not scheduled, remove it
        else {
            // Open undo button
            SpringAnimation(this.state.animUndoY, 0).start();
            this.undoTimeout = setTimeout(() => {
                // Close undo button after 10 seconds
                SpringAnimation(this.state.animUndoY, 56 + 48 + 12).start();
            }, 10 * 1000);

            // Remove task
            await new Promise((resolve, reject) => {
                const success = user.tasks.Remove(task) === 'removed';
                if (success) this.setState({ tasks: [...user.tasks.Get()] }, resolve);
                else resolve();
            });
        }

        user.LocalSave();
        user.OnlineSave();
    }

    undo = () => {
        // Close undo button
        SpringAnimation(this.state.animUndoY, 56 + 48 + 12).start();
        clearTimeout(this.undoTimeout);

        user.tasks.Undo();
        user.LocalSave();
        user.OnlineSave();
        this.setState({ tasks: [...user.tasks.Get()] });
    }

    /** @param {import('../../../Class/Tasks').Task} item */
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

        if (draggedItem === null) return;
        const index = Math.floor((newY + scrollY) / 46);
        const currIndex = user.tasks.tasksSort.indexOf(draggedItem.Title);
        if (index !== currIndex && user.tasks.Move(draggedItem, index)) {
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
    /** @param {GestureResponderEvent} event */
    onTouchEnd = (event) => {
        this.setState({
            scrollable: true,
            draggedItem: null
        });
        user.LocalSave().then(user.OnlineSave);
    }
    /** @param {NativeSyntheticEvent<NativeScrollEvent>} event */
    onScroll = (event) => {
        this.flatlist.contentOffsetY = event.nativeEvent.contentOffset.y;
    }
}

export default BackTasks;