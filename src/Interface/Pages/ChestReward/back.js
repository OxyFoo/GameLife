import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import { Character } from 'Interface/Components';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('Data/Items').StuffID} StuffID
 * 
 * @typedef {Object} ChestRewardProps
 * @property {number} chestRarity
 * @property {StuffID} itemID
 * @property {() => void} callback
 * 
 * @typedef {Object} OxRewardProps
 * @property {'ox'} chestRarity
 * @property {number} oxCount
 * @property {() => void} callback
 */

class BackChestReward extends PageBase {
    state = {
        animGlobal: new Animated.Value(.7),
        animChest: new Animated.Value(0),
        animItem: new Animated.Value(0),
        animInteractions: new Animated.Value(0),

        layoutFrameOx: {
            width: 0,
            height: 0
        }
    }

    buttonEnabled = false;

    /**
     * @param {Object} props
     * @param {ChestRewardProps | OxRewardProps} props.args
     */
    constructor(props) {
        super(props);

        if (props.args.chestRarity === undefined || props.args.callback === undefined) {
            throw new Error('[ChestReward] Missing arguments');
        }

        if (props.args.chestRarity === 'ox') {
            this.chestRarity = props.args.chestRarity;
            this.oxCount = props.args.oxCount;
            this.callback = props.args.callback;

            this.text = langManager.curr['shop']['iap']['reward-page-text']
                .replace('{}', this.oxCount.toString());
            this.rarityColor = themeManager.GetColor('ox');
            return;
        }

        const itemID = props.args['itemID'];
        const item = dataManager.items.GetByID(itemID);
        if (item === null) {
            user.interface.console.AddLog('error', `ChestReward: item not found (${itemID})`);
            user.interface.BackHandle();
            return;
        }

        this.text = langManager.GetText(item.Name);
        this.textSecondary = langManager.curr['rarities'][item.Rarity];
        this.rarityColor = themeManager.GetRariryColors(item.Rarity)[0];
        this.character = new Character('character-reward', user.character.sexe, 'skin_01', 0);
        this.character.SetEquipment([ itemID.toString() ]);
        this.characterSize = dataManager.items.GetContainerSize(item.Slot);
        this.chestRarity = props.args.chestRarity;
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
    onOxLayout = (layout) => {
        const { width, height } = layout.nativeEvent.layout;
        this.setState({ layoutFrameOx: { width, height } })
    }

    onPress = () => {
        if (this.buttonEnabled === false) return;
        this.callback();
    }
}

export default BackChestReward;
