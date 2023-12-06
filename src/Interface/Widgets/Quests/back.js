import React from 'react';
import { Animated, FlatList } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { GetTime } from 'Utils/Time';
import { MinMax } from 'Utils/Functions';
import { GetAbsolutePosition } from 'Utils/UI';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 * @typedef {import('react-native').NativeScrollEvent} NativeScrollEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 * @typedef {import('react-native').NativeSyntheticEvent<NativeScrollEvent>} NativeSyntheticEvent
 * 
 * @typedef {import('Class/Quests').Quest} Quest
 */

class BackQuests extends React.Component {
    state = {
        quests: [],

        /** @type {boolean} Used to disable scroll when dragging a quest */
        scrollable: true,

        /** @type {boolean} Used to enable/disable undo button */
        undoEnabled: false,

        /** @type {Quest | null} Used to manage selected quest */
        draggedItem: null,

        mouseY: new Animated.Value(0)
    }

    constructor(props) {
        super(props);

        /** @type {FlatList<Quest> | null} Used to manage quest sorting */
        this.refFlatlist = null;

        this.flatlist = {
            contentSizeHeight: 0,
            layoutMeasurementHeight: 0,
            contentOffsetY: 0,
        }

        /** @type {NodeJS.Timeout | null} */
        this.undoTimeout = null;

        /** @type {LayoutRectangle | null} */
        this.tmpLayoutContainer = null;

        user.quests.RefreshScheduleQuests();
        this.state.quests = user.quests.Get();
        this.listenerQuest = user.quests.allQuests.AddListener(this.refreshQuests);
    }

    refreshQuests = () => {
        this.setState({ quests: user.quests.Get() });
    }

    componentWillUnmount() {
        user.quests.allQuests.RemoveListener(this.listenerQuest);
    }

    /** @param {Quest} item */
    keyExtractor = (item) => (
        'quest-' + [
            item.Title,
            ...item.Schedule.Type,
            ...item.Schedule.Repeat,
            ...item.Starttime.toString(),
            ...item.Deadline.toString()
        ].join('-')
    )

    /**
     * Add a new quest to the list and open the quest page\
     * Max 8 quests
     */
    addQuest = () => {
        if (this.state.quests.length >= 8) {
            const title = langManager.curr['quests']['alert-questslimit-title'];
            const text = langManager.curr['quests']['alert-questslimit-text'];
            user.interface.popup.Open('ok', [title, text]);
            return;
        }
        user.interface.ChangePage('quest', undefined, true);
    }

    /**
     * @param {Quest} quest
     * @param {(cancel: () => void) => void} callbackRemove
     * @returns {Promise<void>}
     */
    onQuestCheck = async (quest, callbackRemove) => {
        // If quest has a skill, go to activity page
        //     (will be checked when activity is done)
        if (quest.Skill !== null) {
            if (quest.Checked === 0) {
                const { id, isCategory } = quest.Skill;
                const args = isCategory ? { categoryID: id } : { skillID: id };
                user.interface.ChangePage('activity', args, true);
            }
        }

        // If quest is scheduled, check it
        else if (quest.Schedule.Type !== 'none') {
            // Quest already checked
            if (quest.Checked !== 0) {
                user.quests.Uncheck(quest);
                user.GlobalSave();
            } else {
                const checkedTime = GetTime();
                user.quests.Check(quest, checkedTime);
                user.GlobalSave();
            }
        }

        // If quest is not scheduled, remove it
        else {
            // Close undo button after 10 seconds
            this.undoTimeout = setTimeout(() => {
                this.setState({ undoEnabled: false });
            }, 10 * 1000);

            // Remove quest
            callbackRemove((cancel) => {
                const success = user.quests.Remove(quest) === 'removed';
                if (!success) {
                    cancel();
                    return;
                }

                this.setState({
                    quests: [ ...user.quests.Get() ],
                    undoEnabled: true
                });
                user.GlobalSave();
            });
        }

    }

    undo = () => {
        if (user.quests.lastDeletedQuest === null) {
            return;
        }

        // Close undo button
        clearTimeout(this.undoTimeout);

        this.setState({
            quests: [...user.quests.Get()],
            undoEnabled: false
        });

        user.quests.Undo();
        user.GlobalSave();
    }

    /** @param {Quest} item */
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
        this.initialSort = [ ...user.quests.questsSort ];

        GetAbsolutePosition(this.refFlatlist).then(pos => {
            this.tmpLayoutContainer = pos;

            const posY = this.tmpLayoutContainer.y + 32 / 2;
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

        // Move quest selection
        const posY = this.tmpLayoutContainer.y + 32 / 2;
        const newY = MinMax(0, pageY - posY, this.tmpLayoutContainer.height);
        TimingAnimation(this.state.mouseY, newY, 0).start();

        // Change quest order when dragging
        const index = Math.floor((newY + scrollY) / 46);
        const currIndex = user.quests.questsSort.indexOf(draggedItem.Title);
        if (index !== currIndex && user.quests.Move(draggedItem, index)) {
            this.setState({ quests: user.quests.Get() });
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
        // Dragging ended & save new quests order
        this.setState({
            scrollable: true,
            draggedItem: null
        });

        // Save changes if quests order changed (and not just a quest check)
        if (this.initialSort.join() !== user.quests.questsSort.join() &&
            this.initialSort.length === user.quests.questsSort.length) {
                user.GlobalSave();
        }

        // Reset tmpLayoutContainer
        this.tmpLayoutContainer = null;
    }
}

export default BackQuests;
