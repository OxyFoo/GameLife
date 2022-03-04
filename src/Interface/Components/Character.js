import * as React from 'react';
import { Animated } from 'react-native';

import { CHARACTERS, ANIMATIONS } from '../../../res/stuffs/humans/Characters';

import { Sleep } from '../../Utils/Functions';
import { TimingAnimation, WithFunction } from '../../Utils/Animations';

/**
 * @typedef {import('../../../res/stuffs/humans/Characters').PartsName} PartsName
 * @typedef {import('../../../res/stuffs/humans/Characters').CharactersName} CharactersName
 * @typedef {import('../../../res/stuffs/humans/Characters').AnimationsName} AnimationsName
 * @typedef {import('./Frame').default} Frame
 */

class Animated3D {
    constructor(x = 0, y = 0, z = 0) {
        this.x = new Animated.Value(x);
        this.y = new Animated.Value(y);
        this.z = new Animated.Value(z);
    }

    Update(angles, duration) {
        if (typeof(angles) !== 'object') {
            throw new Error('Animated3D.Update: angles must be an object');
        }

        let animations = [];
        const addAnim = (anim, value) => animations.push(TimingAnimation(anim, value, duration));
        if (angles.hasOwnProperty('rX')) addAnim(this.x, angles['rX']);
        if (angles.hasOwnProperty('rY')) addAnim(this.y, angles['rY']);
        if (angles.hasOwnProperty('rZ')) addAnim(this.z, angles['rZ']);
        return animations;
    }
}

class Part {
    /**
     * @param {String} name Name of body part
     * @param {Number} l Distance from parent in pixels (for initial position)
     * @param {Number} a Angle distance from parent in degrees (for initial position)
     * @param {Animated3D} rotation Rotation of body part in degrees
     * @param {Number} [zIndex=0] Z-index of body part
     */
    constructor(name, l, a, rotation, zIndex = 0) {
        this.name = name;
        this.zIndex = zIndex;

        // Initial position from parent
        this.l = l;
        this.a = a;

        // Current absolute position
        this.rotation = rotation;
        this.pos = new Animated.ValueXY({ x: 0, y: 0 });

        /** @type {Part} */
        this.parent = null;

        /** @type {Array<Part>} part */
        this.childs = [];
    }

    /**
     * @param {Animated.ValueXY} position Position of body part in pixels (x, y)
     */
    SetPosition(position) {
        this.pos = position;
    }

    /**
     * @param {Part} child 
     */
    AddChild(child) {
        child.parent = this;
        this.childs.push(child);
    }

    /**
     * @description Return an array of all parent parts in order from root to this part (including this part)
     * @returns {Array<Part>}
     */
    getParents() {
        let parents = [ this ];
        let parent = this.parent;
        while (parent !== null) {
            parents.splice(0, 0, parent);
            parent = parent.parent;
        }
        return parents;
    }

    calculateParentPos = () => {
        let posX = this.pos.x;
        let posY = this.pos.y;
        let rotZ = this.rotation.z;

        /** @param {Part} el */
        const calculateParentPos = (el) => {
            if (el.parent !== null) {
                let currentRotation = new Animated.Value(0);
                const elChilds = el.getParents();
                for (let i = 0; i < elChilds.length-1; i++) {
                    const child = elChilds[i];
                    const childRotation = Animated.add(child.a % 360, child.rotation.z);
                    currentRotation = Animated.add(currentRotation, childRotation);
                }
                currentRotation = Animated.add(currentRotation, el.a);
                currentRotation = Animated.modulo(currentRotation, 360);

                const TETA = Animated.multiply(currentRotation, Math.PI / 180);
                const COS = TETA.interpolate(WithFunction(Math.cos, 20, 2*Math.PI));
                const SIN = TETA.interpolate(WithFunction(Math.sin, 20, 2*Math.PI));
                const radiusX = Animated.multiply(el.l, COS);
                const radiusY = Animated.multiply(el.l, SIN);

                const parentX = Animated.add(el.parent.pos.x, radiusX);
                const parentY = Animated.add(el.parent.pos.y, radiusY);
                const parentR = Animated.modulo(Animated.add(el.parent.rotation.z, el.parent.a), 360);

                posX = Animated.add(posX, parentX);
                posY = Animated.add(posY, parentY);
                rotZ = Animated.add(rotZ, parentR);

                calculateParentPos(el.parent);
            }
        }
        calculateParentPos(this);

        return { posX, posY, rotZ };
    }

    /**
     * @param {CharactersName} character
     * @returns {JSX.Element}
     */
    renderAll(character) {
        /** @param {Part} part @returns {Array<Part>} */
        const getAllChilds = (part) => [part, ...part.childs.map(getAllChilds).flat()];
        const allParts = getAllChilds(this).sort((a, b) => a.zIndex - b.zIndex);
        return [...allParts.map(p => p.renderShadow(character)), ...allParts.map(part => part.render(character))];
    }

    /**
     * @param {CharactersName} character 
     * @returns {JSX.Element}
     */
    renderShadow(character) {
        const { posX, posY, rotZ } = this.calculateParentPos();
        const Charac = CHARACTERS[character];

        return (
            <Charac
                key={'part-shadow-' + this.name + '-' + Math.random()}
                part={this.name}
                fill='none'
                posX={posX}
                posY={posY}
                rotation={rotZ}
                stroke={4}
                zIndex={-9999}
            />
        );
    }

    /**
     * @param {CharactersName} character 
     * @returns {JSX.Element}
     */
    render(character) {
        const { posX, posY, rotZ } = this.calculateParentPos();
        const Charac = CHARACTERS[character];

        return (
            <Charac
                key={'part-' + this.name + '-' + Math.random()}
                part={this.name}
                fill='#e0a98b'
                posX={posX}
                posY={posY}
                rotation={rotZ}
                zIndex={this.zIndex}
            />
        );
    }
}

class Character {
    /**
     * @param {String} name Name of character
     * @param {CharactersName} skin
     * @param {{ x: Number, y: Number }} pos
     */
    constructor(name, skin, pos = { x: 450, y: 280 }) {
        this.name = name;
        this.skin = skin;
        this.pos = pos;

        this.animating = false;
        this.parentFrame = null;
        this.hide = false;
        this.outOfBounds = false;

        this.position = new Animated.ValueXY({ x: 0, y: 0 });
        this.position.addListener(this.__setPosition.bind(this));
        this.SetPositionAbsolute(this.pos.x, this.pos.y, 0);

        /** @type {Array<Animated3D>} */
        this.rotations = {
            bust: new Animated3D(),
            head: new Animated3D(),
            left_arm: new Animated3D(),
            left_forearm: new Animated3D(0, 0, -130),
            left_hand: new Animated3D(0, 0, 20),
            right_arm: new Animated3D(),
            right_forearm: new Animated3D(0, 0, -20),
            right_hand: new Animated3D(0, 0, -20),
            left_thigh: new Animated3D(),
            left_leg: new Animated3D(),
            left_foot: new Animated3D(),
            right_thigh: new Animated3D(),
            right_leg: new Animated3D(),
            right_foot: new Animated3D()
        }

        this.body = new Part('bust', 0, 0, this.rotations.bust);
        this.body.SetPosition(this.position);
        const head = new Part('head', 10, 120, this.rotations.head, 1);

        const left_arm = new Part('left_arm', 110, 140, this.rotations.left_arm, -1);
        const left_forearm = new Part('left_forearm', 120, -25, this.rotations.left_forearm);
        const left_hand = new Part('left_hand', 100, 105, this.rotations.left_hand);

        const right_arm = new Part('right_arm', 110, 30, this.rotations.right_arm, -1);
        const right_forearm = new Part('right_forearm', 140, 40, this.rotations.right_forearm, -1);
        const right_hand = new Part('right_hand', 90, 25, this.rotations.right_hand);

        const left_thigh = new Part('left_thigh', 300, 80, this.rotations.left_thigh, -1);
        const left_leg = new Part('left_leg', 0, 0, this.rotations.left_leg);
        const left_foot = new Part('left_foot', 0, 0, this.rotations.left_foot);
        const right_thigh = new Part('right_thigh', 0, 0, this.rotations.right_thigh);
        const right_leg = new Part('right_leg', 0, 0, this.rotations.right_leg);
        const right_foot = new Part('right_foot', 0, 0, this.rotations.right_foot);

        this.body.AddChild(head);
        // Left arm
        left_forearm.AddChild(left_hand);
        left_arm.AddChild(left_forearm);
        this.body.AddChild(left_arm);
        // Right arm
        right_forearm.AddChild(right_hand);
        right_arm.AddChild(right_forearm);
        this.body.AddChild(right_arm);
        // Left leg
        //left_leg.AddChild(left_foot);
        //left_thigh.AddChild(left_leg);
        //this.body.AddChild(left_thigh);
        // Right leg
        //right_leg.AddChild(right_foot);
        //right_thigh.AddChild(right_leg);
        //this.body.AddChild(right_thigh);

        return;
        setTimeout(() => {
            this.SetAnimation('muscles');
            this.SetPositionRelative(0, 100);
        }, 5000);
    }

    unmount() {
        this.SetFrame(null);
        this.animating = false;
        if (this.position.hasListeners()) {
            this.position.removeAllListeners();
        }
    }

    /**
     * @param {Frame?} frame 
     */
    SetFrame(frame) {
        this.parentFrame = frame;
    }

    Show = () => this.hide = false;
    Hide = () => this.hide = true;

    /**
     * @param {Number} x Default is current position
     * @param {Number} y Default is current position
     * @param {Number} [duration=1000] Duration in ms
     */
    SetPositionAbsolute(x = this.pos.x, y = this.pos.y, duration = 1000) {
        TimingAnimation(this.position, { x, y }, duration).start();
    }

    /**
     * @param {Number} [x=0]
     * @param {Number} [y=0]
     * @param {Number} [duration=1000] Duration in ms
     */
    SetPositionRelative(x = 0, y = 0, duration = 1000) {
        const newX = this.pos.x + x;
        const newY = this.pos.y + y;
        TimingAnimation(this.position, { x: newX, y: newY }, duration).start();
    }

    /**
     * @param {PartsName} partsRotations
     * @param {Number} [duration=1000]
     * @returns {Promise<void>}
     */
    SetPartsRotation = (partsRotations, duration = 1000) => {
        let anims = [];
        const setRotation = (partName) => anims.push(...this.rotations[partName].Update(partsRotations[partName], duration));
        Object.keys(partsRotations).map(setRotation);
        Animated.parallel(anims).start();
    }

    /**
     * @param {AnimationsName} animation
     */
    SetAnimation = async (animation) => {
        if (this.animating) return;

        const { settings, poses } = ANIMATIONS[animation];
        const { loop, sync } = settings;

        const applyAnim = async (index) => {
            if (!this.animating) return;
            const { sleep, duration, rotations } = poses[index];
            await Sleep(sleep);
            this.SetPartsRotation(rotations, duration);
            if (sync) await Sleep(duration);
        }

        this.animating = true;
        while (this.animating) {
            for (let i = 0; i < poses.length; i++) {
                await applyAnim(i);
            }
            if (loop === 'once') {
                this.animating = false;
                break;
            } else if (loop === 'pingpong' && poses.length > 2) {
                for (let i = poses.length-2; i >= 1; i--) {
                    await applyAnim(i);
                }
            }
        }
    }

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

    /** @returns {JSX.Element} */
    render() {
        if (this.parentFrame === null) return null;
        if (this.outOfBounds || this.hide) return null;
        return this.body.renderAll(this.skin);
    }
}

export default Character;