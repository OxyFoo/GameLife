import Body from './Body';
import { ANIMATIONS } from 'Ressources/items/humans/Characters';

/**
 * @typedef {import('./Frame').default} Frame
 * @typedef {import('Ressources/items/humans/Characters').Sexes} Sexes
 * @typedef {import('Ressources/items/humans/Characters').CharactersName} CharactersName
 * @typedef {import('Ressources/items/humans/Characters').AnimationsName} AnimationsName
 */

class Character {
    /**
     * @param {string} name Name of character
     * @param {Sexes} sexe
     * @param {CharactersName} skin
     * @param {number} skinColor
     * @param {{ x: number, y: number }} pos
     */
    constructor(name, sexe, skin, skinColor, pos = { x: 450, y: 340 }) {
        this.name = name;
        this.sexe = sexe;
        this.skin = skin;
        this.skinColor = skinColor;

        /** @type {Array<string>} */
        this.items = [];
        this.parentFrame = null;
        this.hide = false;
        this.outOfBounds = false;

        this.body = new Body(this);
        this.SetPose(sexe === 'MALE' ? 'defaultMale' : 'defaultFemale');
        this.SetPositionAbsolute(pos.x, pos.y);
    }

    unmount() {
        this.Hide();
        this.Refresh();
        this.SetFrame(null);
    }

    /**
     * @param {Frame | null} frame
     */
    SetFrame(frame) {
        this.parentFrame = frame;
        this.Refresh();
    }

    Show = () => (this.hide = false);
    Hide = () => (this.hide = true);

    /**
     * Set items from array of items IDs
     * @param {Array<string>} items
     */
    SetEquipment = (items) => {
        if (!Array.isArray(items)) {
            throw new Error('items must be an array');
        }
        this.items = [...items];
        this.Refresh();
    };

    /**
     * @param {number} x
     * @param {number} y
     */
    SetPositionAbsolute(x, y) {
        this.body.position.x = x;
        this.body.position.y = y;
        this.__positionUpdated({ x, y });
    }

    /**
     * @param {number} [x=0]
     * @param {number} [y=0]
     */
    SetPositionRelative(x = 0, y = 0) {
        this.body.position.x += x;
        this.body.position.y += y;
        this.__positionUpdated({
            x: this.body.position.x,
            y: this.body.position.y
        });
    }

    /**
     * @param {AnimationsName} animation
     */
    SetPose = async (animation) => {
        const { poses } = ANIMATIONS[animation];
        const { translation, rotations } = poses[0];
        this.body.__applyAnimation(translation, rotations);
    };

    /**
     * @private
     * @param {{ x: number, y: number }} param0
     */
    __positionUpdated({ x, y }) {
        if (this.parentFrame !== null) {
            const { width, height } = this.parentFrame.props;
            const delta = 200;
            const outOfBounds = x < -delta || y < -delta || x > width + delta || y > height + delta;
            if (this.outOfBounds !== outOfBounds) {
                this.outOfBounds = outOfBounds;
            }
            this.Refresh();
        }
    }

    Refresh() {
        if (this.parentFrame !== null) {
            this.parentFrame.forceUpdate();
            this.body.getChilds(this.body.firstPart).forEach((part) => {
                part.updateOffsets();
            });
        }
    }
}

export default Character;
