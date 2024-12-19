import { Animated } from 'react-native';

import styles from './style';
import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { MinMax } from 'Utils/Functions';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').GestureResponderEvent} GestureResponderEvent
 *
 * @typedef {import('Types/Data/User/Quests').Quest} Quest
 */

const BackQuestsProps = {
    args: {
        /** @type {Quest | null} */
        quest: null
    }
};

class BackNewPage extends PageBase {
    state = {
        /** @type {Array<Quest>} */
        quests: user.quests.Get(),

        /** @type {Quest | null} Used to manage selected quest */
        draggedItem: null,

        mouseY: new Animated.Value(0),
        scrollable: true
    };

    /** @type {Symbol | null} */
    listenerQuest = null;

    /** @type {number[]} */
    initialSort = [];

    firstPageY = 0;
    selectedIndex = 0;

    containerHeight = 0;
    itemHeight = 46;

    componentDidMount() {
        this.listenerQuest = user.quests.allQuests.AddListener(this.refreshQuests);
    }

    componentWillUnmount() {
        user.quests.allQuests.RemoveListener(this.listenerQuest);
    }

    refreshQuests = () => {
        const quests = user.quests.Get();
        this.setState({ quests });
    };

    /** @param {Quest} item */
    keyExtractor = (item) => 'quest-' + item.title + JSON.stringify(item.skills) + JSON.stringify(item.schedule);

    /**
     * Add a new quest to the list and open the quest page\
     * Max 10 quests
     */
    addQuest = () => {
        if (user.quests.IsMax()) {
            const title = langManager.curr['quests']['alert-questslimit-title'];
            const message = langManager.curr['quests']['alert-questslimit-message'];
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title, message }
            });
            return;
        }
        user.interface.ChangePage('quest', { storeInHistory: false });
    };

    onBackPress = () => {
        user.interface.BackHandle();
    };

    /** @param {LayoutChangeEvent} event */
    onLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.containerHeight = height;
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutItem = (event) => {
        const { height } = event.nativeEvent.layout;
        this.itemHeight = height + styles.questItem.marginBottom;
    };

    /** @param {Quest} item */
    onDrag = (item) => {
        const { draggedItem, quests } = this.state;

        // Prevent dragging if already dragging
        if (draggedItem !== null) {
            return;
        }

        // Prevent dragging if only one quest
        if (quests.length <= 1) {
            return;
        }

        this.setState({ draggedItem: item, scrollable: false });

        this.selectedIndex = user.quests.Get().indexOf(item);
        const initY = this.selectedIndex * this.itemHeight;
        TimingAnimation(this.state.mouseY, initY, 0).start();
    };

    /** @param {GestureResponderEvent} event */
    onTouchStart = (event) => {
        const { pageY } = event.nativeEvent;
        this.initialSort = [...user.quests.sort];
        this.firstPageY = pageY;
    };

    /** @param {GestureResponderEvent} event */
    onTouchMove = (event) => {
        const { draggedItem } = this.state;
        const { pageY } = event.nativeEvent;

        if (draggedItem === null) {
            return;
        }

        // Move quest selection
        const deltaY = pageY - this.firstPageY;
        const relativeY = this.selectedIndex * this.itemHeight;
        const newY = MinMax(0, deltaY + relativeY, this.containerHeight - this.itemHeight);
        TimingAnimation(this.state.mouseY, newY, 0).start();

        // Change quest order when dragging
        const index = Math.floor((newY + this.itemHeight / 2) / this.itemHeight);
        const currIndex = user.quests.sort.indexOf(draggedItem.created);
        if (index !== currIndex && user.quests.Move(draggedItem, index)) {
            this.setState({ quests: user.quests.Get() });
        }
    };

    /** @param {GestureResponderEvent} _event */
    onTouchEnd = (_event) => {
        // Dragging ended & save new quests order
        this.setState({ draggedItem: null, scrollable: true });

        // Save changes if quests order changed
        if (
            this.initialSort.join() !== user.quests.sort.join() &&
            this.initialSort.length === user.quests.sort.length
        ) {
            user.GlobalSave();
        }
    };
}

BackNewPage.defaultProps = BackQuestsProps;
BackNewPage.prototype.props = BackQuestsProps;

export default BackNewPage;
