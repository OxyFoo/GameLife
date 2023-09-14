import { Animated } from 'react-native';

import { WithFunction, TimingAnimation } from 'Utils/Animations';

/**
 * @typedef {import('./Part').default} Part
 */

class Animated3D {
    constructor(rX = 0, rY = 0, rZ = 0) {
        this.rX = new Animated.Value(rX);
        this.rY = new Animated.Value(rY);
        this.rZ = new Animated.Value(rZ);
    }

    /**
     * @param {{ rX: number, rY: number, rZ: number }} angles
     * @param {number} duration Time in milliseconds
     * @returns {Array<Animated.CompositeAnimation>}
     */
    Update(angles, duration) {
        if (typeof(angles) !== 'object') {
            throw new Error('Animated3D.Update: angles must be an object');
        }

        let animations = [];
        const addAnim = (anim, value) => animations.push(TimingAnimation(anim, value, duration));
        if (angles.hasOwnProperty('rX')) addAnim(this.rX, angles['rX']);
        if (angles.hasOwnProperty('rY')) addAnim(this.rY, angles['rY']);
        if (angles.hasOwnProperty('rZ')) addAnim(this.rZ, angles['rZ']);
        return animations;
    }
}

/**
 * @description Return an array of all parent parts in order from root to this part (including this part)
 * @param {Part} el
 * @returns {Array<Part>}
 */
function __getParents(el) {
    let parents = [ el ];
    let parent = el.parent;
    while (parent !== null) {
        parents.splice(0, 0, parent);
        parent = parent.parent;
    }
    return parents;
}

/**
 * @this {Part}
 * @returns {{ x: Animated.Value, y: Animated.Value, rZ: Animated.Value }}
 */
function CalculateParentPos() {
    let posX = this.position.x;
    let posY = this.position.y;
    let rotZ = this.rotation.rZ;

    /** @param {Part} el */
    const calculateParentPos = (el) => {
        if (el.parent !== null) {
            /** @type {Animated.AnimatedAddition<number>} */
            let currentRotation = new Animated.Value(0);
            const elChilds = __getParents(el);
            for (let i = 0; i < elChilds.length-1; i++) {
                const child = elChilds[i];
                const childRotation = Animated.add(child.a % 360, child.rotation.rZ);
                currentRotation = Animated.add(currentRotation, childRotation);
            }
            currentRotation = Animated.add(currentRotation, el.a);
            currentRotation = Animated.modulo(currentRotation, 360);

            const TETA = Animated.multiply(currentRotation, Math.PI / 180);
            const COS = TETA.interpolate(WithFunction(Math.cos, 20, 2*Math.PI));
            const SIN = TETA.interpolate(WithFunction(Math.sin, 20, 2*Math.PI));
            const radiusX = Animated.multiply(el.l, COS);
            const radiusY = Animated.multiply(el.l, SIN);

            const parentX = Animated.add(el.parent.position.x, radiusX);
            const parentY = Animated.add(el.parent.position.y, radiusY);
            const parentR = Animated.modulo(el.parent.rotation.rZ, 360);

            posX = Animated.add(posX, parentX);
            posY = Animated.add(posY, parentY);
            rotZ = Animated.add(rotZ, parentR);

            calculateParentPos(el.parent);
        }
    }
    calculateParentPos(this);

    posX = Animated.add(posX, this.body.firstPart.animPosition.x);
    posY = Animated.add(posY, this.body.firstPart.animPosition.y);

    return { posX, posY, rotZ };
}

export { Animated3D, CalculateParentPos };