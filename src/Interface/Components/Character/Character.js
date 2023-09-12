import Body from './Body';
import { TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('./Frame').default} Frame
 * @typedef {import('Ressources/items/humans/Characters').CharactersName} CharactersName
 * @typedef {import('Ressources/items/humans/Characters').AnimationsName} AnimationsName
 * @typedef {import('Ressources/items/humans/Characters').Sexes} Sexes
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
        this.pos = pos;

        /** @type {Array<string>} */
        this.items = [];
        this.parentFrame = null;
        this.hide = false;
        this.outOfBounds = false;

        this.body = new Body(this);
        this.body.position.addListener(this.__setPosition.bind(this));
        this.SetPositionAbsolute(this.pos.x, this.pos.y, 0);
        this.render = this.body.render;
        this.SetAnimation('idle');

        // Comment "return" to tests (position, animations, etc)
        return;
        setTimeout(() => {
            this.SetAnimation('muscles');
            this.SetPositionRelative(0, 100);
        }, 3000);
    }

    unmount() {
        this.body.StopAnimation();
        if (this.body.position.hasListeners()) {
            this.body.position.removeAllListeners();
        }
        this.Hide();
        this.__refresh();
        this.SetFrame(null);
    }

    /**
     * @param {Frame?} frame 
     */
    SetFrame(frame) {
        this.parentFrame = frame;
        this.__refresh();
    }

    Show = () => this.hide = false;
    Hide = () => this.hide = true;

    /**
     * Set items from array of items IDs
     * @param {Array<string>} items
     */
    SetEquipment = (items) => {
        if (!Array.isArray(items)) {
            throw new Error('items must be an array');
        }
        this.items = [...items];
        this.__refresh();
    }

    /**
     * @param {number} x Default is current position
     * @param {number} y Default is current position
     * @param {number} [duration=1000] Duration in ms
     */
    SetPositionAbsolute(x = this.pos.x, y = this.pos.y, duration = 1000) {
        TimingAnimation(this.body.position, { x, y }, duration).start();
    }

    /**
     * @param {number} [x=0]
     * @param {number} [y=0]
     * @param {number} [duration=1000] Duration in ms
     */
    SetPositionRelative(x = 0, y = 0, duration = 1000) {
        const newX = this.pos.x + x;
        const newY = this.pos.y + y;
        TimingAnimation(this.body.position, { x: newX, y: newY }, duration).start();
    }

    /**
     * @param {AnimationsName} animation
     */
    SetAnimation = (animation) => { this.body.SetAnimation(animation); }

    __setPosition({ x, y }) {
        this.pos = { x, y };

        if (this.parentFrame !== null) {
            const { width, height } = this.parentFrame.props;
            const delta = 200;
            const outOfBounds = x < -delta || y < -delta || x > width+delta || y > height+delta;
            if (this.outOfBounds !== outOfBounds) {
                this.outOfBounds = outOfBounds;
                this.__refresh();
            }
        }
    }

    __refresh() {
        if (this.parentFrame !== null) {
            this.parentFrame.forceUpdate();
        }
    }
}

export default Character;