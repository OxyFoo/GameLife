import Body from './Body';
import { TimingAnimation } from '../../../Utils/Animations';

/**
 * @typedef {import('./Frame').default} Frame
 * @typedef {import('../../../../res/items/humans/Characters').CharactersName} CharactersName
 * @typedef {import('../../../../res/items/humans/Characters').AnimationsName} AnimationsName
 */

class Character {
    /**
     * @param {String} name Name of character
     * @param {CharactersName} skin
     * @param {Array<String>} items
     * @param {{ x: Number, y: Number }} pos
     */
    constructor(name, skin, items, pos = { x: 450, y: 280 }) {
        this.name = name;
        this.skin = skin;
        this.pos = pos;

        /** @type {Array<String>} */
        this.items = items;
        this.parentFrame = null;
        this.hide = false;
        this.outOfBounds = false;

        this.body = new Body(this);
        this.body.position.addListener(this.__setPosition.bind(this));
        this.SetPositionAbsolute(this.pos.x, this.pos.y, 0);

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
     * @param {Number} x Default is current position
     * @param {Number} y Default is current position
     * @param {Number} [duration=1000] Duration in ms
     */
    SetPositionAbsolute(x = this.pos.x, y = this.pos.y, duration = 1000) {
        TimingAnimation(this.body.position, { x, y }, duration).start();
    }

    /**
     * @param {Number} [x=0]
     * @param {Number} [y=0]
     * @param {Number} [duration=1000] Duration in ms
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

    /**
     * @param {boolean} [onlyItems=false]
     * @returns {JSX.Element}
     */
    render(onlyItems = false) {
        if (this.parentFrame === null) return null;
        if (this.outOfBounds || this.hide) return null;
        return !onlyItems ? this.body.renderAll() : this.body.renderItems();
    }
}

export default Character;