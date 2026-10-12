import dataManager from 'Managers/DataManager';
import { IUserData } from '@oxyfoo/gamelife-types/Interface/IUserData';
import DynamicVar from 'Utils/DynamicVar';
import DevEye from 'Utils/DevEye';
import { ANALYTICS_EVENTS } from 'Constants/Analytics';
import { IsCatalystCompatible, IsForgeOpen } from '@oxyfoo/gamelife-types/Rules/TechnoForge';

/**
 * @typedef {import('Managers/UserManager').default} UserManager
 * @typedef {import('Data/App/Items').Slot} Slot
 * @typedef {import('Data/App/Titles').Title} Title
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').Stuff} Stuff
 * @typedef {import('@oxyfoo/gamelife-types/TCP/GameLife/Request_ServerToClient').ServerRequestForgeStuff} ServerRequestForgeStuff
 *
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Inventory').SaveObject_Inventory} SaveObject_Inventory
 *
 * @typedef {{ result: 'ok', success: boolean, chance: number, cost: number, stuff: Stuff } | { result: Exclude<ServerRequestForgeStuff['result'], 'ok'> }} ForgeOutcome
 */

/** @extends {IUserData<SaveObject_Inventory>} */
class Inventory extends IUserData {
    /** @param {UserManager} user */
    constructor(user) {
        super('inventory');

        this.user = user;
    }

    /**
     * @description List of title IDs owned by the user
     * @type {DynamicVar<number[]>}
     */
    titleIDs = new DynamicVar(/** @type {number[]} */ ([]));

    /**
     * @description List of stuffs owned by the user
     * @type {Stuff[]}
     */
    stuffs = [];

    #token = 0;

    Clear = () => {
        this.stuffs = [];
        this.titleIDs.Set([]);
        this.#token = 0;
    };

    /** @returns {SaveObject_Inventory} */
    Get = () => {
        return {
            titleIDs: this.titleIDs.Get(),
            stuffs: this.stuffs,
            token: this.#token
        };
    };

    /** @param {Partial<SaveObject_Inventory>} data */
    Load = (data) => {
        if (typeof data.titleIDs !== 'undefined') this.titleIDs.Set(data.titleIDs);
        if (typeof data.stuffs !== 'undefined') this.stuffs = data.stuffs;
        if (typeof data.token !== 'undefined') this.#token = data.token;

        // A cache written before the copies carried their rarity and stats: the next online load fetches everything
        if (this.stuffs.some((stuff) => typeof stuff.Rarity === 'undefined' || typeof stuff.Stats === 'undefined')) {
            this.#token = 0;
        }
    };

    /** @returns {SaveObject_Inventory} */
    Save = () => {
        return {
            titleIDs: this.titleIDs.Get(),
            stuffs: this.stuffs,
            token: this.#token
        };
    };

    LoadOnline = async () => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'get-inventories', token: this.#token });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'get-inventories' ||
            response.result === 'error'
        ) {
            this.user.interface.console?.AddLog('error', `[Inventory] Failed to load inventory (${response})`);
            return false;
        }

        if (response.result === 'already-up-to-date') {
            this.user.interface.console?.AddLog('info', '[Inventory] Already up to date');
            return true;
        }

        this.titleIDs.Set(response.result.titleIDs);
        this.stuffs = response.result.stuffs;
        this.#token = response.result.token;

        // The equipped copies may have new stats
        this.user.experience.UpdateExperience();

        this.user.interface.console?.AddLog('info', `[Titles] ${this.titleIDs.Get().length} titles loaded`);
        this.user.interface.console?.AddLog('info', `[Stuffs] ${this.stuffs.length} stuffs loaded`);
        return true;
    };

    /** @returns {Title[]} */
    GetTitles = () => {
        /** @type {Title[]} */
        const titles = [];
        for (const ID of this.titleIDs.Get()) {
            const title = dataManager.titles.GetByID(ID);
            if (title !== null) titles.push(title);
        }
        return titles;
    };

    /**
     * @param {number} titleID
     * @returns {boolean}
     */
    AddTitle = (titleID) => {
        const ownedTitles = this.titleIDs.Get();
        if (ownedTitles.includes(titleID)) {
            return false;
        }

        this.titleIDs.Set([...ownedTitles, titleID]);
        return true;
    };

    /**
     * @param {number} ID
     * @returns {Stuff | null}
     */
    GetStuffByID = (ID) => this.stuffs.find((stuff) => stuff.ID === ID) || null;

    /**
     * A copy of the starter outfit: never sold, never a forge catalyst
     * @param {Stuff} stuff
     * @returns {boolean}
     */
    IsStarterStuff = (stuff) => dataManager.items.IsStarter(stuff.ItemID);

    /**
     * Copies the forge cannot raise today (Rules/TechnoForge): a closed step (epic for now)
     * @returns {number[]}
     */
    GetClosedForgeIDs = () => this.stuffs.filter((stuff) => !IsForgeOpen(stuff.Rarity)).map((stuff) => stuff.ID);

    /**
     * Copies that are not even offered as a catalyst for this main copy: the starter outfit and
     * those of another rarity than the main copy (none while no main copy is chosen)
     * @param {Stuff | null} main
     * @returns {number[]}
     */
    GetHiddenCatalystIDs = (main) =>
        this.stuffs
            .filter(
                (stuff) =>
                    this.IsStarterStuff(stuff) || (main !== null && !IsCatalystCompatible(main.Rarity, stuff.Rarity))
            )
            .map((stuff) => stuff.ID);

    /**
     * Copies that can never be a catalyst of the forge for this main copy (Rules/TechnoForge): the
     * equipped ones, the starter outfit, and those of another rarity than the main copy (any rarity
     * while no main copy is chosen)
     * @param {Stuff | null} main
     * @param {number[]} equippedIDs
     * @returns {number[]}
     */
    GetLockedCatalystIDs = (main, equippedIDs) =>
        this.stuffs
            .filter(
                (stuff) =>
                    equippedIDs.includes(stuff.ID) ||
                    this.IsStarterStuff(stuff) ||
                    (main !== null && !IsCatalystCompatible(main.Rarity, stuff.Rarity))
            )
            .map((stuff) => stuff.ID);

    /**
     * @param {Slot} slot
     * @returns {Stuff[]}
     */
    GetStuffsBySlot = (slot) => {
        return this.stuffs.filter((stuff) => {
            const item = dataManager.items.GetByID(stuff.ItemID);
            if (item === null) return false;
            return item.Slot === slot;
        });
    };

    /**
     * Sell a stuff item from inventory
     * @param {number} stuffID - The stuff ID to sell (inventory item ID)
     * @returns {Promise<'ok' | 'invalid-item' | 'item-not-found' | 'item-equipped' | 'item-starter' | 'error'>}
     */
    SellStuff = async (stuffID) => {
        const response = await this.user.server2.tcp.SendAndWait({
            action: 'sell-stuff',
            stuffID: stuffID
        });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'sell-stuff'
        ) {
            this.user.interface.console?.AddLog('error', `[Inventory] Failed to sell stuff (${response})`);
            return 'error';
        }

        if (response.result !== 'ok') {
            this.user.interface.console?.AddLog('warn', `[Inventory] Sell stuff failed: ${response.result}`);
            return response.result;
        }

        // Update local inventory
        this.stuffs = this.stuffs.filter((stuff) => stuff.ID !== stuffID);

        // Update Ox amount
        if (typeof response.ox === 'number') {
            this.user.informations.ox.Set(response.ox);
        }

        this.user.interface.console?.AddLog('info', `[Inventory] Stuff ${stuffID} sold successfully`);
        return 'ok';
    };

    /**
     * One attempt of the Techno-Forge: the main copy against 1 or 2 catalysts (Rules/TechnoForge).
     * On 'ok' the attempt happened whatever `success`: the catalysts are gone and the cost is paid.
     * @param {number} stuffID The copy to upgrade; it keeps its ID (an equipped copy stays equipped)
     * @param {number[]} catalystIDs 1 or 2 other copies, not equipped; consumed whatever the outcome
     * @returns {Promise<ForgeOutcome>}
     */
    ForgeStuff = async (stuffID, catalystIDs) => {
        const response = await this.user.server2.tcp.SendAndWait({ action: 'forge-stuff', stuffID, catalystIDs });

        if (
            response === 'interrupted' ||
            response === 'not-sent' ||
            response === 'timeout' ||
            response.status !== 'forge-stuff'
        ) {
            this.user.interface.console?.AddLog('error', `[Inventory] Failed to forge stuff (${response})`);
            return { result: 'error' };
        }

        if (response.result !== 'ok') {
            this.user.interface.console?.AddLog('warn', `[Inventory] Forge stuff refused: ${response.result}`);
            if (typeof response.ox === 'number') {
                this.user.informations.ox.Set(response.ox);
            }
            return { result: response.result };
        }

        const success = response.success === true;
        const upgraded = response.stuff ?? null;

        // The catalysts are gone; the main copy is replaced in place (same ID, the avatar keeps wearing it)
        this.stuffs = this.stuffs.filter((stuff) => !catalystIDs.includes(stuff.ID));
        if (upgraded !== null) {
            this.stuffs = this.stuffs.map((stuff) => (stuff.ID === upgraded.ID ? upgraded : stuff));
        }
        if (typeof response.ox === 'number') {
            this.user.informations.ox.Set(response.ox);
        }
        if (typeof response.token === 'number') {
            this.#token = response.token;
        }

        DevEye.Event(success ? ANALYTICS_EVENTS.FORGE_SUCCESS : ANALYTICS_EVENTS.FORGE_FAILED);

        // An equipped main copy may carry new stats
        this.user.experience.UpdateExperience();
        this.user.SaveLocal();

        const main = upgraded ?? this.GetStuffByID(stuffID);
        if (main === null) {
            return { result: 'error' };
        }

        this.user.interface.console?.AddLog(
            'info',
            `[Inventory] Forge ${success ? 'succeeded' : 'failed'} (${stuffID})`
        );
        return { result: 'ok', success, chance: response.chance ?? 0, cost: response.cost ?? 0, stuff: main };
    };
}

export default Inventory;
