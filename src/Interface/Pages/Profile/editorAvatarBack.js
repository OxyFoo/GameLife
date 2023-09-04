import * as React from 'react';
import { Animated } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import dataManager from 'Managers/DataManager';

import { Sleep } from 'Utils/Functions';
import { Character, Frame } from 'Interface/Components';
import { SpringAnimation } from 'Utils/Animations';

const AvatarProps = {
    refParent: null,
    onChangeState: (opened) => {}
}

/**
 * @typedef {import('Class/Inventory').Stuff} Stuff
 * @typedef {import('Data/Items').Slot} Slot
 * @typedef {'skin'|'skinColor'} SkinSlot
 * @typedef {Slot|SkinSlot} AvatarSlot
 */

/**
 * @type {Array<string>} Used to store the list of available slots for the avatar.
 */
const Slots = [ 'hair', 'top', 'bottom', 'shoes' ];

class EditorAvatarBack extends React.Component {
    state = {
        characterPosY: 0,
        characterHeight: 0,
        characterBottomPosY: 0,

        editorOpened: false,
        editorAnim: new Animated.Value(0),
        editorHeight: 0,

        /** @type {AvatarSlot?} */
        slotSelected: null,

        /** @type {Stuff?} */
        stuffSelected: null,

        /** @type {Array<Stuff>?} */
        stuffsSelected: null,

        /** @type {boolean} */
        itemSelected: false,

        itemAnim: new Animated.Value(0),
        itemSelectionHeight: 0,

        /** @type {number} */
        sexeSelected: 0,

        /** @type {boolean} */
        selling: false
    }

    constructor(props) {
        super(props);

        /** @type {{[key: string]: Character}} */
        this.slotCharacters = {};
        Slots.forEach(slot => {
            this.slotCharacters[slot] = new Character(
                'itemslot-' + slot,
                user.character.sexe,
                user.character.skin,
                user.character.skinColor
            );
        });
        this.updateEquippedItems();

        /** @type {Frame} */
        this.refFrame = null;
    }

    onCharacterLayout = (event) => {
        const { y, height } = event.nativeEvent.layout;
        this.setState({ characterBottomPosY: y + height, characterHeight: height });

        if (this.state.characterPosY === 0) {
            this.setState({ characterPosY: y });
        }
    }
    onEditorLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ editorHeight: height });
    }
    onItemSelectionLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        this.setState({ itemSelectionHeight: height });
    }

    OpenEditor = () => {
        this.setState({ editorOpened: true });
        this.selectSlot(this.state.slotSelected || 'hair');
        this.props.onChangeState(true);

        SpringAnimation(this.state.editorAnim, 1).start();
        if (this.props.refParent.refPage !== null) {
            this.props.refParent.refPage.GotoY(0);
        }

        user.interface.SetCustomBackHandler(this.CloseEditor);
    }
    CloseEditor = () => {
        this.setState({ editorOpened: false });
        this.props.onChangeState(false);

        SpringAnimation(this.state.editorAnim, 0).start();
        user.interface.ResetCustomBackHandler();
        return false;
    }

    updateEquippedItems = () => {
        Slots.forEach(slot => {
            const character = this.slotCharacters[slot];

            if (!user.inventory.avatar.hasOwnProperty(slot)) {
                user.interface.console.AddLog('error', `Slot ${slot} doesn't exist`);
                return;
            }

            const stuffID = user.inventory.avatar[slot];
            const stuff = user.inventory.GetStuffByID(stuffID);
            if (stuff !== null) {
                if (character.items.length === 0 || character.items[0] !== stuff.ItemID) {
                    character.SetEquipment([ stuff.ItemID ]);
                }
            }
        });
    }

    /** @param {AvatarSlot} slot */
    selectSlot = (slot) => {
        const stuffs = user.inventory.GetStuffsBySlot(slot);

        this.setState({
            slotSelected: slot,
            stuffsSelected: stuffs
        });
        this.selectItem(); // Reset selection
    };

    /** @param {Stuff} stuff */
    selectItem = async (stuff = null) => {
        this.setState({ stuffSelected: stuff });

        if (stuff === null) {
            this.setState({ itemSelected: false });
            SpringAnimation(this.state.itemAnim, 0).start();
        } else {
            SpringAnimation(this.state.itemAnim, 1).start();
            await Sleep(200); this.setState({ itemSelected: true });
        }
    }

    /** @param {AvatarSlot} slot */
    getButtonBackground = (slot) => {
        return this.state.slotSelected === slot ? 'main2' : 'backgroundCard';
    }

    buttonSellPress = () => {
        const lang = langManager.curr['profile-avatar'];
        const { stuffSelected, selling } = this.state;

        // No item selected (Not supposed to be called) or already selling
        if (stuffSelected === null || selling) {
            return;
        }

        // Item already equipped
        const equippedStuff = user.inventory.GetEquipments();
        if (equippedStuff.includes(stuffSelected.ID)) {
            const title = lang['alert-isequipped-title'];
            const text = lang['alert-isequipped-text'];
            user.interface.popup.Open('ok', [ title, text ]);
            return;
        }

        // Confirm sell
        const item = dataManager.items.GetByID(stuffSelected.ItemID);
        const title = lang['alert-sellconfirm-title'];
        const text = lang['alert-sellconfirm-text'].replace('{}', Math.ceil(item.Value * .75));
        user.interface.popup.Open('yesno', [ title, text ], async (btn) => {
            if (btn === 'no') return;

            // Sell item
            this.setState({ selling: true });
            const response = await user.server.Request('sellStuff', { stuffID: stuffSelected.ID });
            this.setState({ selling: false });

            if (response === null || response['status'] !== 'ok') {
                const title = lang['alert-sellfailed-title'];
                const text = lang['alert-sellfailed-text'];
                user.interface.popup.Open('ok', [ title, text ]);
                return;
            }

            // Update inventory & Ox amount
            user.inventory.LoadOnline({ stuffs: response['stuffs'] });
            user.informations.ox.Set(parseInt(response['ox']));
            this.selectSlot(this.state.slotSelected);

            // Show success message
            const title = lang['alert-sellsuccess-title'];
            let text = lang['alert-sellsuccess-text'];
            text = text.replace('{}', dataManager.GetText(item.Name));
            text = text.replace('{}', Math.ceil(item.Value * .75));
            user.interface.popup.Open('ok', [ title, text ], undefined, false);
        });
    }

    buttonEquipPress = () => {
        const { slotSelected, stuffSelected } = this.state;
        if (stuffSelected === null) {
            return;
        }

        user.inventory.Equip(slotSelected, stuffSelected.ID);
        user.character.SetEquipment(user.inventory.GetEquippedItemsID());
        user.OnlineSave();

        this.forceUpdate();
        this.refFrame.forceUpdate();
        this.slotCharacters[slotSelected].SetEquipment([stuffSelected.ItemID]);
    }
}

EditorAvatarBack.prototype.props = AvatarProps;
EditorAvatarBack.defaultProps = AvatarProps;

export default EditorAvatarBack;