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

    /** @type {ChestRewardArgs['chestRarity']} */
    chestRarity = 'common';
    text = '';
    textSecondary = '';
    rarityColor = '';

    /**
     * @param {Object} props
     * @param {ChestRewardProps | OxRewardProps} props.args
     */
    constructor(props) {
        super(props);

        this.loadReward(props.args);
    }

    /**
     * The reward on display. Read again on every focus: `Rewards` chains several rewards through
     * this single page, so the fields below outlive the constructor.
     * @param {ChestRewardArgs} args
     */
    loadReward = (args) => {
        if (args.chestRarity === undefined || args.callback === undefined) {
            throw new Error('[ChestReward] Missing arguments');
        }

        this.chestRarity = args.chestRarity;
        this.callback = args.callback;
        this.textSecondary = '';

        if (args.chestRarity === 'ox') {
            this.oxCount = args.oxCount;

            this.text = langManager.curr['shop']['iap']['reward-page-text'].replace('{}', this.oxCount.toString());
            this.rarityColor = themeManager.GetColor('ox');
            return;
        }

        const itemID = args['itemID'];
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
        this.avatarItems = user.avatar.GetPreviewAvatarItems(itemID);
        this.avatarPosition = dataManager.items.GetContainerSize(item.Slot);
    };

    /** Chest closed, item hidden, button dead: the reward opens itself again from there */
    playReward = () => {
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);

        this.buttonEnabled = false;
        this.state.animGlobal.setValue(0.7);
        this.state.animChest.setValue(0);
        this.state.animItem.setValue(0);
        this.state.animInteractions.setValue(0);

        SpringAnimation(this.state.animGlobal, 1).start();
        TimingAnimation(this.state.animChest, 4, 1000).start();
        this.timeout1 = setTimeout(() => {
            SpringAnimation(this.state.animItem, 1).start();
        }, 1000);
        this.timeout2 = setTimeout(() => {
            SpringAnimation(this.state.animInteractions, 1).start();
            this.buttonEnabled = true;
        }, 2000);
    };

    componentDidMount() {
        this.playReward();
    }
    componentWillUnmount() {
        clearTimeout(this.timeout1);
        clearTimeout(this.timeout2);
    }

    /**
     * Next reward of the chain: the page was never left, so nothing remounts. The reward is read
     * from the new args and the chest closes again to open on it.
     * @param {this['props']} props
     */
    componentDidFocused(props) {
        this.loadReward(props.args);
        this.playReward();
        this.forceUpdate();
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
}

BackChestReward.defaultProps = BackChestRewardProps;
BackChestReward.prototype.props = BackChestRewardProps;

export default BackChestReward;
