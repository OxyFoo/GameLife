import React from 'react';
import { Animated, Easing } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';
import { PickerPanel } from './PickerPanel';

import { FormatThousands } from 'Utils/Raids';
import { Sleep } from 'Utils/Functions';
import { TimingAnimation } from 'Utils/Animations';
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
 * @typedef {import('react-native').LayoutChangeEvent} LayoutChangeEvent
 * @typedef {import('react-native').LayoutRectangle} LayoutRectangle
 *
 * @typedef {'main' | 0 | 1} PickerTarget The main slot, or the index of a catalyst slot
 * @typedef {'caption-empty' | 'caption-max-rarity' | 'caption-need-catalyst'} ForgeBlocker
 * @typedef {'idle' | 'extracting' | 'charging' | 'success' | 'failure'} ForgePhase The choreography of an attempt
 */

const BackTechnoForgeProps = {
    args: {}
};

/** One catalyst slot fills in this long; the next one starts a little after (ms) */
const FILL_MS = 900;
const FILL_STAGGER_MS = 220;
/** The path lights up from the catalysts to the main slot in this long (ms) */
const PATH_MS = 750;
/** The main copy charges at least this long, even when the server answers faster (ms) */
const CHARGING_MIN_MS = 1500;
/** One shake back and forth (ms); the amplitude grows over the charging */
const SHAKE_PERIOD_MS = 110;
/** The verdict stays on the forge this long before the result screen (ms) */
const SUCCESS_HOLD_MS = 650;
const FAILURE_HOLD_MS = 1100;

const EMPTY_LAYOUT = /** @type {LayoutRectangle} */ ({ x: 0, y: 0, width: 0, height: 0 });

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

        /** @type {ForgePhase} */
        phase: 'idle',

        /** Where the main slot is in the forge area: the bursts start from its centre */
        layoutMain: EMPTY_LAYOUT,

        ox: user.informations.ox.Get()
    };

    //
    // The choreography, every value on the native driver (same tools as the chest reward)
    //

    /** 0 → 1: each catalyst slot fills from the bottom, like a liquid */
    animFills = [new Animated.Value(0), new Animated.Value(0)];
    /** 0 → 1: the path lights up from the catalysts to the main slot (branches, bar, stem) */
    animPath = new Animated.Value(0);
    /** Oscillation of the charge, looped (0 → 1 per period) */
    animShake = new Animated.Value(0);
    /** Intensity of the charge, 0 → 1 over the charging: scales the shake and the glow. Never snapped, always eased */
    animCharge = new Animated.Value(0);
    /** Breathing of the glow while charging (0 → 1 → 0, looped) */
    animGlow = new Animated.Value(0);
    /** The verdict: 0 → 1 is the crash of the upgrade on success, the drop of the copy on failure */
    animOutcome = new Animated.Value(0);
    /** The burst of particles: dust on failure, sparks on success */
    animParticles = new Animated.Value(0);
    /** 0 → 1: everything but the main copy fades before the result screen */
    animFade = new Animated.Value(0);

    /** @type {Animated.CompositeAnimation | null} */
    chargingLoop = null;

    /**
     * The copies as they were when the attempt started. The server's answer updates the inventory
     * while the copy still charges: the slots keep showing this until the verdict plays.
     * @type {{ main: Stuff, catalysts: (Stuff | null)[] } | null}
     */
    frozenSlots = null;

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
        this.chargingLoop?.stop();
        user.interface.RemoveCustomBackHandler(this.blockBack);
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

    openShop = () => {
        if (!this.state.forging) {
            user.interface.ChangePage('shop');
        }
    };

    /** @param {LayoutChangeEvent} event */
    onLayoutMain = (event) => this.setState({ layoutMain: event.nativeEvent.layout });

    //
    // What the slots hold, read live: a copy sold or lost elsewhere simply reads as an empty slot
    //

    /** @returns {Stuff | null} The upgraded copy is only shown once the verdict plays */
    GetMain = () => {
        if (this.frozenSlots !== null && this.state.phase !== 'success') {
            return this.frozenSlots.main;
        }
        return this.state.mainID === null ? null : user.inventory.GetStuffByID(this.state.mainID);
    };

    /** @returns {(Stuff | null)[]} One entry per catalyst slot */
    GetCatalysts = () => {
        if (this.frozenSlots !== null) {
            return this.frozenSlots.catalysts;
        }
        return this.state.catalystIDs.map((ID) => (ID === null ? null : user.inventory.GetStuffByID(ID)));
    };

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

    /** @returns {number | null} Ox of an attempt; the price of a common copy while the slot is empty, nothing for a closed step */
    GetCost = () => {
        const main = this.GetMain();
        const rarity = main === null ? 'common' : main.Rarity;
        return IsForgeOpen(rarity) ? ForgeCost(rarity) : null;
    };

    /** @returns {number} Chance as a fraction; without catalyst, the base rate of one catalyst alone */
    GetChance = () => {
        const catalysts = this.GetCatalystIDs().length;
        return catalysts === 0 ? FORGE_BASE_CHANCE[1] / 100 : ForgeChance(catalysts, this.GetDexterity());
    };

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
                    selectedID={
                        target === 'main' ? (this.GetMain()?.ID ?? null) : (this.GetCatalysts()[target]?.ID ?? null)
                    }
                    excludedIDs={excludedIDs}
                    lockedIDs={
                        target === 'main'
                            ? []
                            : user.inventory.GetLockedCatalystIDs(this.GetMain(), user.avatar.GetEquipments())
                    }
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
            // A copy moved to the main slot leaves the catalyst slot it was in, and the catalysts
            // of another rarity than the new main copy leave theirs
            const main = stuffID === null ? null : user.inventory.GetStuffByID(stuffID);
            const locked = user.inventory.GetLockedCatalystIDs(main, user.avatar.GetEquipments());
            this.setState({
                mainID: stuffID,
                catalystIDs: catalystIDs.map((ID) =>
                    ID !== null && (ID === stuffID || locked.includes(ID)) ? null : ID
                )
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
        if (this.state.forging) {
            return;
        }
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
        const locked = user.inventory.GetLockedCatalystIDs(main, user.avatar.GetEquipments());
        if (
            main === null ||
            target === null ||
            cost === null ||
            !IsForgeOpen(main.Rarity) ||
            catalystIDs.length === 0 ||
            catalystIDs.some((ID) => ID === main.ID || locked.includes(ID))
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
     * The attempt and its choreography run together: the catalysts fly into the main copy, which
     * charges (shakes, glows) until the server has answered and the charge has lasted its minimum,
     * then the verdict plays on the forge before the result screen takes over.
     * @param {Stuff} main
     * @param {number[]} catalystIDs
     * @param {Rarities} target
     */
    Forge = async (main, catalystIDs, target) => {
        const lang = langManager.curr['technoforge'];
        const langShop = langManager.curr['shop'];

        if (this.state.forging) {
            return;
        }
        this.frozenSlots = { main, catalysts: this.GetCatalysts() };
        this.setState({ forging: true, phase: 'extracting' });
        user.interface.AddCustomBackHandler(this.blockBack);

        /** @type {import('Data/User/Inventory').ForgeOutcome} */
        let outcome;
        try {
            const request = user.inventory.ForgeStuff(main.ID, catalystIDs);
            await this.PlayExtraction(catalystIDs.length);
            this.setState({ phase: 'charging' });
            this.PlayCharging();
            [outcome] = await Promise.all([request, Sleep(CHARGING_MIN_MS)]);
        } finally {
            user.interface.RemoveCustomBackHandler(this.blockBack);
        }
        this.StopCharging();

        // Forced away meanwhile (lost connection...): the answer is already in the inventory
        if (user.interface.GetCurrentPageName() !== 'technoforge') {
            return;
        }

        if (outcome.result === 'ok') {
            this.setState({ phase: outcome.success ? 'success' : 'failure' });
            if (outcome.success) {
                await this.PlaySuccess();
            } else {
                await this.PlayFailure();
            }
            if (user.interface.GetCurrentPageName() !== 'technoforge') {
                return;
            }
            const changed = user.interface.ChangePage('technoforge_result', {
                args: {
                    success: outcome.success,
                    stuff: outcome.stuff,
                    fromRarity: main.Rarity,
                    toRarity: target,
                    cost: outcome.cost,
                    continuous: outcome.success
                },
                storeInHistory: false
            });
            if (changed === false) {
                // The engine was busy: the forge stays, cleared, the inventory already holds the answer
                this.ResetChoreography();
                this.frozenSlots = null;
                this.ResetSlots();
                this.setState({ forging: false, phase: 'idle' });
            }
            return;
        }

        // Refused: the catalysts come back, say why, empty the slots, and refresh what another device may have changed
        await this.PlayRestore();
        this.frozenSlots = null;
        this.setState({ forging: false, phase: 'idle' });
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
        } else if (outcome.result === 'catalyst-rarity') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: lang['alert-catalyst-rarity-title'], message: lang['alert-catalyst-rarity-text'] }
            });
        } else if (outcome.result === 'catalyst-starter') {
            user.interface.popup?.OpenT({
                type: 'ok',
                data: { title: lang['alert-catalyst-starter-title'], message: lang['alert-catalyst-starter-text'] }
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

    //
    // The steps of the choreography; each resolves when its animation is done
    //

    /**
     * 1. Each catalyst slot fills from the bottom, one after the other; a little before the last one is
     *    full, the path lights up from the catalysts to the main slot
     * @param {number} count
     */
    PlayExtraction = (count) =>
        new Promise((resolve) => {
            const fills = this.animFills.slice(0, count).map((anim, index) =>
                Animated.sequence([
                    Animated.delay(index * FILL_STAGGER_MS),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: FILL_MS,
                        easing: Easing.inOut(Easing.quad),
                        useNativeDriver: true
                    })
                ])
            );
            const lastFillStart = (count - 1) * FILL_STAGGER_MS;
            const path = Animated.sequence([
                Animated.delay(lastFillStart + Math.round(FILL_MS * 0.7)),
                Animated.timing(this.animPath, {
                    toValue: 1,
                    duration: PATH_MS,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true
                })
            ]);
            Animated.parallel([...fills, path]).start(() => resolve(undefined));
        });

    /** 2. The main copy charges: a looped shake and glow whose intensity rises over the charging */
    PlayCharging = () => {
        TimingAnimation(this.animCharge, 1, CHARGING_MIN_MS, true).start();
        this.chargingLoop = Animated.parallel([
            Animated.loop(
                Animated.sequence([
                    Animated.timing(this.animShake, { toValue: 1, duration: SHAKE_PERIOD_MS, useNativeDriver: true }),
                    Animated.timing(this.animShake, { toValue: 0, duration: SHAKE_PERIOD_MS, useNativeDriver: true })
                ])
            ),
            Animated.loop(
                Animated.sequence([TimingAnimation(this.animGlow, 1, 500), TimingAnimation(this.animGlow, 0, 500)])
            )
        ]);
        this.chargingLoop.start();
    };

    /** The loops stop once the charge has eased back to 0: nothing is ever snapped in one frame */
    StopCharging = () => {
        this.chargingLoop?.stop();
        this.chargingLoop = null;
    };

    /**
     * 3a. The crash of the upgrade: the shake dies in the flash, the copy is punched up and settles,
     *     sparks fly in the new rarity, then the rest of the page fades towards the result
     */
    PlaySuccess = () =>
        new Promise((resolve) => {
            Animated.sequence([
                Animated.parallel([
                    TimingAnimation(this.animGlow, 1, 120),
                    Animated.timing(this.animCharge, {
                        toValue: 0,
                        duration: 420,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true
                    }),
                    Animated.spring(this.animOutcome, { toValue: 1, bounciness: 10, speed: 14, useNativeDriver: true }),
                    Animated.timing(this.animParticles, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true
                    })
                ]),
                Animated.delay(SUCCESS_HOLD_MS),
                Animated.timing(this.animFade, { toValue: 1, duration: 300, useNativeDriver: true })
            ]).start(() => {
                this.StopCharging();
                resolve(undefined);
            });
        });

    /** 3b. The charge dies out, the copy drops back in its slot and the catalysts fall to dust */
    PlayFailure = () =>
        new Promise((resolve) => {
            Animated.sequence([
                Animated.parallel([
                    TimingAnimation(this.animGlow, 0, 300),
                    Animated.timing(this.animCharge, {
                        toValue: 0,
                        duration: 350,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true
                    }),
                    Animated.timing(this.animPath, { toValue: 0, duration: 500, useNativeDriver: true }),
                    ...this.animFills.map((anim) =>
                        Animated.timing(anim, { toValue: 0, duration: 500, useNativeDriver: true })
                    )
                ]),
                Animated.parallel([
                    Animated.spring(this.animOutcome, { toValue: 1, bounciness: 14, speed: 10, useNativeDriver: true }),
                    Animated.timing(this.animParticles, {
                        toValue: 1,
                        duration: 900,
                        easing: Easing.out(Easing.quad),
                        useNativeDriver: true
                    })
                ]),
                Animated.delay(FAILURE_HOLD_MS)
            ]).start(() => {
                this.StopCharging();
                resolve(undefined);
            });
        });

    /** Refused by the server: the charge dies, the path goes dark and the slots empty themselves */
    PlayRestore = () =>
        new Promise((resolve) => {
            Animated.parallel([
                TimingAnimation(this.animGlow, 0, 250),
                Animated.timing(this.animCharge, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(this.animPath, { toValue: 0, duration: 400, useNativeDriver: true }),
                ...this.animFills.map((anim) =>
                    Animated.timing(anim, { toValue: 0, duration: 400, useNativeDriver: true })
                )
            ]).start(() => {
                this.ResetChoreography();
                resolve(undefined);
            });
        });

    ResetChoreography = () => {
        this.StopCharging();
        for (const anim of [
            ...this.animFills,
            this.animPath,
            this.animShake,
            this.animCharge,
            this.animGlow,
            this.animOutcome,
            this.animParticles,
            this.animFade
        ]) {
            anim.setValue(0);
        }
    };

    onBack = () => user.interface.BackHandle();
}

BackTechnoForge.defaultProps = BackTechnoForgeProps;
BackTechnoForge.prototype.props = BackTechnoForgeProps;

export default BackTechnoForge;
