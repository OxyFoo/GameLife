import React from 'react';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import { PickerPanel } from './PickerPanel';

import { FormatThousands } from 'Utils/Raids';
import {
    FORGE_BASE_CHANCE,
    FORGE_DEX_BONUS_MAX,
    FORGE_DEX_CAP,
    ForgeChance,
    ForgeCost,
    ForgeDexBonus,
    IsForgeOpen,
    NextRarity
} from '@oxyfoo/gamelife-types/Rules/TechnoForge';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 * @typedef {import('@oxyfoo/gamelife-types/Global/Rarities').Rarities} Rarities
 *
 * @typedef {'main' | 0 | 1} PickerTarget The main slot, or the index of a catalyst slot
 * @typedef {'caption-empty' | 'caption-max-rarity' | 'caption-need-catalyst'} ForgeBlocker
 */

const BackTechnoForgeProps = {
    args: {}
};

/**
 * The Techno-Forge: a main copy against 1 or 2 catalysts, the roll happens on the server
 * (Rules/TechnoForge, previewed here with the same numbers). Not kept mounted on purpose: every
 * visit starts with empty slots.
 */
class BackTechnoForge extends PageBase {
    state = {
        /** @type {'authenticated' | 'offline'} */
        onlineState: 'offline',

        /** @type {number | null} Inventory ID of the copy to upgrade */
        mainID: null,

        /** @type {(number | null)[]} Inventory IDs of the catalysts, one entry per slot */
        catalystIDs: [null, null],

        /** The request is flying: the slots and the back button are frozen */
        forging: false,

        ox: user.informations.ox.Get()
    };

    /** @type {Symbol | null} */
    listenerTcpStateChange = null;

    /** @type {Symbol | null} */
    listenerDeviceAuthStateChange = null;

    /** @type {Symbol | null} */
    listenerUserAuthEmail = null;

    /** @type {Symbol | null} */
    listenerOx = null;

    /** @type {Symbol | null} */
    listenerExperience = null;

    componentDidMount() {
        this.listenerTcpStateChange = user.server2.tcp.state.AddListener(this.refreshOnlineState);
        this.listenerDeviceAuthStateChange = user.server2.deviceAuth.state.AddListener(this.refreshOnlineState);
        this.listenerUserAuthEmail = user.server2.userAuth.email.AddListener(this.refreshOnlineState);
        this.listenerOx = user.informations.ox.AddListener(this.onOxChange);
        // The dexterity bonus follows the stats (an outfit changed elsewhere)
        this.listenerExperience = user.experience.experience.AddListener(this.onExperienceChange);
        this.updateOnlineState(true);
    }

    componentWillUnmount() {
        user.server2.tcp.state.RemoveListener(this.listenerTcpStateChange);
        user.server2.deviceAuth.state.RemoveListener(this.listenerDeviceAuthStateChange);
        user.server2.userAuth.email.RemoveListener(this.listenerUserAuthEmail);
        user.informations.ox.RemoveListener(this.listenerOx);
        user.experience.experience.RemoveListener(this.listenerExperience);
    }

    refreshOnlineState = () => this.updateOnlineState(false);

    /** @param {boolean} force Re-render even when nothing changed */
    updateOnlineState = (force) => {
        const newOnlineState = user.server2.IsAuthenticated() ? 'authenticated' : 'offline';
        if (force === true || newOnlineState !== this.state.onlineState) {
            this.setState({ onlineState: newOnlineState });
        }
    };

    /** @param {number} ox */
    onOxChange = (ox) => this.setState({ ox });

    onExperienceChange = () => this.forceUpdate();

    openShop = () => user.interface.ChangePage('shop');

    //
    // What the slots hold, read live: a copy sold or lost elsewhere simply reads as an empty slot
    //

    /** @returns {Stuff | null} */
    GetMain = () => (this.state.mainID === null ? null : user.inventory.GetStuffByID(this.state.mainID));

    /** @returns {(Stuff | null)[]} One entry per catalyst slot */
    GetCatalysts = () => this.state.catalystIDs.map((ID) => (ID === null ? null : user.inventory.GetStuffByID(ID)));

    /** @returns {number[]} The catalysts actually there */
    GetCatalystIDs = () => {
        /** @type {number[]} */
        const IDs = [];
        for (const stuff of this.GetCatalysts()) {
            if (stuff !== null) {
                IDs.push(stuff.ID);
            }
        }
        return IDs;
    };

    /** Dexterity with the equipped copies, as the server computes it for the roll */
    GetDexterity = () => user.experience.GetStatsNumber().dex;

    /** @returns {Rarities | null} The rarity reached on success; null with an empty slot or at the top */
    GetTargetRarity = () => {
        const main = this.GetMain();
        return main === null ? null : NextRarity(main.Rarity);
    };

    /** @returns {number | null} Ox of an attempt; the price of a common copy while the slot is empty */
    GetCost = () => {
        const main = this.GetMain();
        return ForgeCost(main === null ? 'common' : main.Rarity);
    };

    /** @returns {number} Chance as a fraction; without catalyst, the base of one catalyst is shown */
    GetChance = () => ForgeChance(Math.max(1, this.GetCatalystIDs().length), this.GetDexterity());

    /** @returns {number} Dexterity bonus as a fraction */
    GetDexBonus = () => ForgeDexBonus(this.GetDexterity());

    /** @returns {ForgeBlocker | null} Why the forge cannot start yet, null when it can */
    GetBlocker = () => {
        const main = this.GetMain();
        if (main === null) {
            return 'caption-empty';
        }
        if (!IsForgeOpen(main.Rarity)) {
            return 'caption-max-rarity';
        }
        if (this.GetCatalystIDs().length === 0) {
            return 'caption-need-catalyst';
        }
        return null;
    };

    CanForge = () => {
        const cost = this.GetCost();
        return (
            this.state.onlineState === 'authenticated' &&
            !this.state.forging &&
            this.GetBlocker() === null &&
            cost !== null &&
            this.state.ox >= cost
        );
    };

    //
    // Filling the slots
    //

    /** @param {PickerTarget} target */
    OpenPicker = (target) => {
        const lang = langManager.curr['technoforge'];
        const { mainID, catalystIDs } = this.state;

        // The other slots cannot hold the same copy; a catalyst can never be an equipped copy
        /** @type {(number | null)[]} */
        const others = target === 'main' ? catalystIDs : [mainID, catalystIDs[target === 0 ? 1 : 0]];
        /** @type {number[]} */
        const excludedIDs = [];
        for (const ID of others) {
            if (ID !== null) {
                excludedIDs.push(ID);
            }
        }

        user.interface.bottomPanel?.Open({
            content: (
                <PickerPanel
                    title={
                        target === 'main'
                            ? lang['picker-title-main']
                            : lang['picker-title-catalyst'].replace('{}', (target + 1).toString())
                    }
                    hint={target === 'main' ? lang['picker-hint-main'] : lang['picker-hint-catalyst']}
                    selectedID={target === 'main' ? mainID : catalystIDs[target]}
                    excludedIDs={excludedIDs}
                    lockedIDs={target === 'main' ? [] : user.avatar.GetEquipments()}
                    onSelect={(stuffID) => this.SetSlot(target, stuffID)}
                    onClear={() => this.SetSlot(target, null)}
                />
            )
        });
    };

    /**
     * @param {PickerTarget} target
     * @param {number | null} stuffID
     */
    SetSlot = (target, stuffID) => {
        const { mainID, catalystIDs } = this.state;
        if (target === 'main') {
            // A copy moved to the main slot leaves the catalyst slot it was in
            this.setState({
                mainID: stuffID,
                catalystIDs: catalystIDs.map((ID) => (ID !== null && ID === stuffID ? null : ID))
            });
        } else {
            const next = [...catalystIDs];
            next[target] = stuffID;
            this.setState({ catalystIDs: next, mainID: mainID !== null && mainID === stuffID ? null : mainID });
        }
        user.interface.bottomPanel?.Close();
    };

    ResetSlots = () => this.setState({ mainID: null, catalystIDs: [null, null] });

    OpenInfo = () => {
        const lang = langManager.curr['technoforge'];
        user.interface.popup?.OpenT({
            type: 'ok',
            data: {
                title: lang['info-title'],
                message: lang['info-message']
                    .replace('{}', FORGE_BASE_CHANCE[1].toString())
                    .replace('{}', FORGE_BASE_CHANCE[2].toString())
                    .replace('{}', FORGE_DEX_BONUS_MAX.toString())
                    .replace('{}', FormatThousands(FORGE_DEX_CAP))
            }
        });
    };

    //
    // The attempt
    //

    OnForgePress = () => {
        const lang = langManager.curr['technoforge'];
        const langShop = langManager.curr['shop'];

        if (!user.server2.IsAuthenticated()) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: lang['alert-notconnected-title'], message: lang['alert-notconnected-text'] }
            });
            return;
        }

        // Checked again at the press: the inventory may have moved since the slots were filled
        const main = this.GetMain();
        const catalystIDs = this.GetCatalystIDs();
        const target = this.GetTargetRarity();
        const cost = this.GetCost();
        const equipped = user.avatar.GetEquipments();
        if (
            main === null ||
            target === null ||
            cost === null ||
            !IsForgeOpen(main.Rarity) ||
            catalystIDs.length === 0 ||
            catalystIDs.some((ID) => ID === main.ID || equipped.includes(ID))
        ) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: lang['alert-invalid-title'], message: lang['alert-invalid-text'] }
            });
            this.ResetSlots();
            return;
        }
        if (this.state.ox < cost) {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: langShop['popup-notenoughox-title'], message: langShop['popup-notenoughox-message'] }
            });
            return;
        }

        user.interface.popup?.OpenT({
            type: 'yesno',
            data: {
                title: lang['alert-confirm-title'],
                message: lang['alert-confirm-message'].replace('{}', cost.toString())
            },
            callback: (button) => {
                if (button === 'yes') {
                    this.Forge(main, catalystIDs, target);
                }
            }
        });
    };

    /**
     * @param {Stuff} main
     * @param {number[]} catalystIDs
     * @param {Rarities} target
     */
    Forge = async (main, catalystIDs, target) => {
        const lang = langManager.curr['technoforge'];
        const langShop = langManager.curr['shop'];

        this.setState({ forging: true });
        user.interface.AddCustomBackHandler(this.blockBack);
        const outcome = await user.inventory.ForgeStuff(main.ID, catalystIDs);
        user.interface.RemoveCustomBackHandler(this.blockBack);

        // Forced away meanwhile (lost connection...): the answer is already in the inventory
        if (user.interface.GetCurrentPageName() !== 'technoforge') {
            return;
        }
        this.setState({ forging: false });

        if (outcome.result === 'ok') {
            user.interface.ChangePage('technoforge_result', {
                args: {
                    success: outcome.success,
                    stuff: outcome.stuff,
                    fromRarity: main.Rarity,
                    toRarity: target,
                    cost: outcome.cost
                },
                storeInHistory: false
            });
            return;
        }

        // Refused: say why, empty the slots, and refresh what another device may have changed
        this.ResetSlots();
        if (outcome.result === 'not-enough-ox') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: langShop['popup-notenoughox-title'], message: langShop['popup-notenoughox-message'] }
            });
        } else if (outcome.result === 'catalyst-equipped') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: lang['alert-catalyst-equipped-title'], message: lang['alert-catalyst-equipped-text'] }
            });
        } else if (outcome.result === 'max-rarity' || outcome.result === 'forge-unavailable') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: lang['alert-max-rarity-title'], message: lang['alert-max-rarity-text'] }
            });
        } else if (outcome.result === 'error') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-error-title'],
                    message: lang['alert-error-text'].replace('{}', outcome.result)
                }
            });
        } else {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: lang['alert-invalid-title'], message: lang['alert-invalid-text'] }
            });
        }
        if (outcome.result !== 'error') {
            user.inventory
                .LoadOnline()
                .then(() => user.avatar.LoadOnline())
                .then(() => this.forceUpdate());
        }
    };

    /** The hardware back button is consumed while the request is flying */
    blockBack = () => false;

    onBack = () => user.interface.BackHandle();
}

BackTechnoForge.defaultProps = BackTechnoForgeProps;
BackTechnoForge.prototype.props = BackTechnoForgeProps;

export default BackTechnoForge;
