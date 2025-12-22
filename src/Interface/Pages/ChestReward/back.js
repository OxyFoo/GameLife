import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Data/App/Items').ItemID} ItemID
 * @typedef {import('Class/Rewards').Rarities} Rarities
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('Data/App/Items').CharacterContainerSize} CharacterContainerSize
 *
 * @typedef {object} ChestRewardProps
 * @property {Rarities} chestRarity
 * @property {ItemID} itemID
 * @property {() => void} callback
 *
 * @typedef {object} OxRewardProps
 * @property {'ox'} chestRarity
 * @property {number} oxCount
 * @property {() => void} callback
 *
 * @typedef {ChestRewardProps | OxRewardProps} ChestRewardArgs
 */

const BackChestRewardProps = {
    /** @type {ChestRewardArgs} */
    args: {
        chestRarity: 'common',
        itemID: 'bottom_01',
        callback: () => {}
    }
};

class BackChestReward extends PageBase {
    state = {
        animGlobal: new Animated.Value(0.7),
        animChest: new Animated.Value(0),
        animItem: new Animated.Value(0),
        animInteractions: new Animated.Value(0),
        frameSize: 0
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
    oxCount = 0;
    callback = () => {};

    /**
     * @param {Object} props
     * @param {ChestRewardProps | OxRewardProps} props.args
     */
    constructor(props) {
        super(props);

        if (props.args.chestRarity === undefined || props.args.callback === undefined) {
            throw new Error('[ChestReward] Missing arguments');
        }

        /** @type {ChestRewardArgs['chestRarity']} */
        this.chestRarity = props.args.chestRarity;

        if (props.args.chestRarity === 'ox') {
            this.oxCount = props.args.oxCount;
            this.callback = props.args.callback;

            this.text = langManager.curr['shop']['iap']['reward-page-text'].replace('{}', this.oxCount.toString());
            this.rarityColor = themeManager.GetColor('ox');
            return;
        }

        const itemID = props.args['itemID'];
        const item = dataManager.items.GetByID(itemID);
        if (item === null) {
            user.interface.console?.AddLog('error', `ChestReward: item not found (${itemID})`);
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
        TimingAnimation(this.state.animChest, 4, 1000).start();
        this.timeout1 = setTimeout(() => {
            SpringAnimation(this.state.animItem, 1).start();
        }, 1000);
        this.timeout2 = setTimeout(() => {
            SpringAnimation(this.state.animInteractions, 1).start();
            this.buttonEnabled = true;
        }, 2000);
    }
    componentWillUnmount() {
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
    }

    /** @param {LayoutChangeEvent} layout */
    onFrameLayout = (layout) => {
        const { width, height } = layout.nativeEvent.layout;
        const frameSize = Math.min(width, height);
        this.setState({ frameSize });
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

BackChestReward.defaultProps = BackChestRewardProps;
BackChestReward.prototype.props = BackChestRewardProps;

export default BackChestReward;
