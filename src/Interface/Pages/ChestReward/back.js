import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import { Character, PageBase } from 'Interface/Components';
import { SpringAnimation, TimingAnimation } from 'Utils/Animations';

class BackChestReward extends PageBase {
    state = {
        animGlobal: new Animated.Value(.7),
        animChest: new Animated.Value(0),
        animItem: new Animated.Value(0),
        animInteractions: new Animated.Value(0)
    }

    constructor(props) {
        super(props);

        this.itemID = props.args['itemID'];
        this.chestRarity = props.args['chestRarity'];
        this.callback = props.args['callback'];

        if (this.itemID === undefined || this.chestRarity === undefined || this.callback === undefined) {
            throw new Error('[ChestReward] Missing arguments');
        }

        const item = dataManager.items.GetByID(this.itemID);
        if (item === null) {
            user.interface.console.AddLog('error', `ChestReward: item not found (${this.itemID})`);
            user.interface.BackHandle();
            return;
        }

        this.buttonEnabled = false;
        this.text = langManager.GetText(item.Name);
        this.textSecondary = langManager.curr['rarities'][item.Rarity];
        this.rarityColor = themeManager.GetRariryColors(item.Rarity)[0];
        this.character = new Character('character-reward', user.character.sexe, 'skin_01', 0);
        this.character.SetEquipment([ this.itemID.toString() ]);
        this.characterSize = dataManager.items.GetContainerSize(item.Slot);
    }

    componentDidMount() {
        super.componentDidMount();

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

    onPress = () => {
        if (this.buttonEnabled === false) return;
        this.callback();
    }
}

export default BackChestReward;
