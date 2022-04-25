import { Animated } from "react-native";

import { TimingAnimation } from '../Utils/Animations';

class Animated3D {
    constructor(rX = 0, rY = 0, rZ = 0) {
        this.rX = new Animated.Value(rX);
        this.rY = new Animated.Value(rY);
        this.rZ = new Animated.Value(rZ);
    }

    /**
     * @param {{ rX: Number, rY: Number, rZ: Number }} angles
     * @param {Number} duration Time in milliseconds
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

export default Animated3D;