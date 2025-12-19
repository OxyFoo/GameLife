import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { SpringAnimation } from 'Utils/Animations';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Data/App/Items').ItemID} ItemID
 * @typedef {import('Class/Rewards').Rarities} Rarities
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('Data/App/Items').CharacterContainerSize} CharacterContainerSize
 *
 * @typedef {object} ItemRewardProps
 * @property {ItemID} itemID
 * @property {() => void} callback
 */

const BackItemRewardProps = {
    /** @type {ItemRewardProps} */
    args: {
        itemID: 'bottom_01',
        callback: () => {}
    }
};

class BackItemReward extends PageBase {
    state = {
        animGlobal: new Animated.Value(0.7),
        animItem: new Animated.Value(0),
        animInteractions: new Animated.Value(0),

        layoutFrame: {
            width: 0,
            height: 0
        }
    };

    buttonEnabled = false;

    /** @type {ItemConfig[]} */
    avatarItems = [];
    /** @type {CharacterContainerSize | null} */
    avatarPosition = null;
    /** @type {AvatarName} */
    avatarBody = 'human_00';
    /** @type {string} */
    avatarBodyColor = BODY_COLORS[0];
    callback = () => {};

    /**
     * @param {Object} props
     * @param {ItemRewardProps} props.args
     */
    constructor(props) {
        super(props);

        if (props.args.itemID === undefined || props.args.callback === undefined) {
            throw new Error('[ItemReward] Missing arguments');
        }

        const itemID = props.args.itemID;
        const item = dataManager.items.GetByID(itemID);
        if (item === null) {
            user.interface.console?.AddLog('error', `ItemReward: item not found (${itemID})`);
            user.interface.BackHandle();
            return;
        }

        this.text = langManager.GetText(item.Name);
        this.textSecondary = langManager.curr['rarities'][item.Rarity];
        this.rarityColor = themeManager.GetRariryColors(item.Rarity)[0];

        // Configuration du nouvel avatar
        this.avatarBody = user.avatar.avatar.skin || 'human_00';
        this.avatarBodyColor = BODY_COLORS[user.avatar.avatar.skinColor] || BODY_COLORS[0];
        this.avatarItems = this.getPreviewItems(item);
        this.avatarPosition = dataManager.items.GetContainerSize(item.Slot);
        this.callback = props.args.callback;
    }

    componentDidMount() {
        SpringAnimation(this.state.animGlobal, 1).start();
        SpringAnimation(this.state.animItem, 1).start();
        this.timeout1 = setTimeout(() => {
            SpringAnimation(this.state.animInteractions, 1).start();
            this.buttonEnabled = true;
        }, 500);
    }

    componentWillUnmount() {
        clearTimeout(this.timeout1);
    }

    /** @param {LayoutChangeEvent} layout */
    onFrameLayout = (layout) => {
        const { width, height } = layout.nativeEvent.layout;
        this.setState({ layoutFrame: { width, height } });
    };

    onPress = () => {
        if (this.buttonEnabled === false) return;
        this.callback?.();
    };

    /**
     * Get items to display in avatar preview
     * For 'top' items, also show the user's bottom item
     * @param {import('@oxyfoo/gamelife-types/Data/App/Items').Item} item
     * @returns {ItemConfig[]}
     */
    getPreviewItems = (item) => {
        /** @type {ItemConfig[]} */
        const baseItems = [{ id: item.ID }];

        // For 'top' items, also show bottom item (like in avatar editor slots)
        if (item.Slot === 'top') {
            const bottomStuffID = user.avatar.avatar.bottom;
            const bottomStuff = user.inventory.GetStuffByID(bottomStuffID);
            const bottomItemID = bottomStuff ? bottomStuff.ItemID : 'bottom_00';
            baseItems.push({ id: bottomItemID });
        }

        return baseItems;
    };
}

BackItemReward.defaultProps = BackItemRewardProps;
BackItemReward.prototype.props = BackItemRewardProps;

export default BackItemReward;
