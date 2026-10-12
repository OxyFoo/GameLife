import React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';
import themeManager from 'Managers/ThemeManager';

import PageBase from 'Interface/FlowEngine/PageBase';
import ItemDetailPanel from 'Interface/Pages/Profile/AvatarEditor/InventoryPanel/ItemDetailPanel';
import { SpringAnimation } from 'Utils/Animations';
import { BODY_COLORS } from 'Interface/Pages/Profile/AvatarEditor/avatarConstants';

/**
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('@oxyfoo/avatar-factory').ItemConfig} ItemConfig
 * @typedef {import('@oxyfoo/avatar-factory').AvatarName} AvatarName
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 * @typedef {import('@oxyfoo/gamelife-types/Global/Rarities').Rarities} Rarities
 * @typedef {import('Data/App/Items').CharacterContainerSize} CharacterContainerSize
 *
 * @typedef {object} TechnoForgeResultArgs
 * @property {boolean} success
 * @property {Stuff} stuff The main copy after the attempt (unchanged on failure)
 * @property {Rarities} fromRarity
 * @property {Rarities} toRarity The rarity aimed at, reached on success
 * @property {number} cost Ox paid for the attempt
 * @property {boolean} [continuous] The copy is already on screen (the forge grew it towards here): no pop
 */

const BackTechnoForgeResultProps = {
    /** @type {TechnoForgeResultArgs} */
    args: {
        success: false,
        stuff: { ID: 0, ItemID: 'hair_00', CreatedBy: 0, CreatedAt: 0, Rarity: 'common', Stats: {} },
        fromRarity: 'common',
        toRarity: 'rare',
        cost: 0
    }
};

/** The outcome of an attempt of the forge, built like the item reward screen */
class BackTechnoForgeResult extends PageBase {
    state = {
        animGlobal: new Animated.Value(0.7),
        animItem: new Animated.Value(0),
        animText: new Animated.Value(0),
        animInteractions: new Animated.Value(0),

        layoutFrame: {
            width: 0,
            height: 0
        }
    };

    buttonEnabled = false;

    /** @type {TechnoForgeResultArgs} */
    outcome = BackTechnoForgeResultProps.args;
    /** @type {Item | null} */
    item = null;
    itemName = '';
    rarityColor = themeManager.GetColor('border');

    /** @type {ItemConfig[]} */
    avatarItems = [];
    /** @type {CharacterContainerSize | null} */
    avatarPosition = null;
    /** @type {AvatarName} */
    avatarBody = 'human_00';
    /** @type {string} */
    avatarBodyColor = BODY_COLORS[0];

    /**
     * @param {Object} props
     * @param {TechnoForgeResultArgs} props.args
     */
    constructor(props) {
        super(props);

        const { args } = props;
        if (typeof args?.success !== 'boolean' || !args.stuff || !args.fromRarity || !args.toRarity) {
            throw new Error('[TechnoForgeResult] Missing arguments');
        }
        this.outcome = args;

        // Coming from the forge, the copy is already big on screen: it only settles, nothing pops
        if (args.continuous === true) {
            this.state.animGlobal.setValue(0.92);
            this.state.animItem.setValue(1);
        }

        const item = dataManager.items.GetByID(args.stuff.ItemID);
        if (item === null) {
            user.interface.console?.AddLog('error', `TechnoForgeResult: item not found (${args.stuff.ItemID})`);
            user.interface.BackHandle();
            return;
        }

        this.item = item;
        this.itemName = langManager.GetText(item.Name);
        this.rarityColor = args.success
            ? themeManager.GetRariryColors(args.toRarity)[0]
            : themeManager.GetColor('border');

        this.avatarBody = user.avatar.avatar.skin || 'human_00';
        this.avatarBodyColor = BODY_COLORS[user.avatar.avatar.skinColor] || BODY_COLORS[0];
        this.avatarItems = user.avatar.GetPreviewAvatarItems(args.stuff.ItemID);
        this.avatarPosition = dataManager.items.GetContainerSize(item.Slot);
    }

    componentDidMount() {
        SpringAnimation(this.state.animGlobal, 1).start();
        SpringAnimation(this.state.animItem, 1).start();
        SpringAnimation(this.state.animText, 1).start();
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

    /** The detail panel of the copy, without the sale (that flow lives in the avatar editor) */
    onViewItem = () => {
        if (this.buttonEnabled === false || this.item === null) {
            return;
        }
        const { stuff } = this.outcome;
        const item = this.item;
        user.interface.bottomPanel?.Open({
            content: (
                <ItemDetailPanel
                    stuffID={stuff.ID}
                    itemName={stuff.ItemID}
                    slot={item.Slot}
                    bodyType={user.avatar.GetBodyType()}
                    bodyColor={user.avatar.GetBodyColorHex()}
                    isEquipped={user.avatar.GetEquipments().includes(stuff.ID)}
                    showSell={false}
                    onEquip={() => user.avatar.Equip(item.Slot, stuff.ID)}
                    onSell={() => {}}
                    onClose={() => user.interface.bottomPanel?.Close()}
                />
            )
        });
    };

    /** Back to the forge, remounted with empty slots */
    onBackToForge = () => {
        if (this.buttonEnabled === false) {
            return;
        }
        user.interface.BackHandle();
    };
}

BackTechnoForgeResult.defaultProps = BackTechnoForgeResultProps;
BackTechnoForgeResult.prototype.props = BackTechnoForgeResultProps;

export default BackTechnoForgeResult;
