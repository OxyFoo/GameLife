/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').CharactersID} CharactersID
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').ItemID} ItemID
 */

class Avatar {
    /**
     * @param {CharactersID} skin
     * @param {number} skinColor
     */
    constructor(skin, skinColor) {
        this.skin = skin;
        this.skinColor = skinColor;
        this.items = /** @type {ItemID[]} */ ([]);
    }

    /**
     * Set items from array of items IDs
     * @param {ItemID[]} items
     */
    SetEquipment = (items) => {
        if (!Array.isArray(items)) {
            throw new Error('items must be an array');
        }
        this.items = [...items];
    };
}

export default Avatar;
