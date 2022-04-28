import { Animated } from 'react-native';

import Part from './Part';
import { Sleep } from '../../../Utils/Functions';
import Animated3D from '../../../Utils/Animated3D';
import { TimingAnimation } from '../../../Utils/Animations';
import { ANIMATIONS } from '../../../../res/items/humans/Characters';

/**
 * @typedef {import('../../../../res/items/humans/Characters').PartsName} PartsName
 */

class Body {
    /**
     * @typedef {import('./Character').default} Character
     * @param {Character} character Parent character
     */
    constructor(character) {
        this.character = character;

        this.animating = false;
        this.animations = null;
        this.position = new Animated.ValueXY({ x: 0, y: 0 });
        this.rotations = {
            bust: new Animated3D(),
            head: new Animated3D(),
            left_arm: new Animated3D(),
            left_forearm: new Animated3D(),
            left_hand: new Animated3D(),
            right_arm: new Animated3D(),
            right_forearm: new Animated3D(),
            right_hand: new Animated3D(),
            left_thigh: new Animated3D(),
            left_leg: new Animated3D(),
            left_foot: new Animated3D(),
            right_thigh: new Animated3D(),
            right_leg: new Animated3D(),
            right_foot: new Animated3D()
        }

        const body = new Part(this, 'bust', 5);

        const head = new Part(this, 'head', 1);
        const right_ear = new Part(this, 'right_ear', 8);
        const right_eye = new Part(this, 'right_eye', 8);
        const right_eyebrow = new Part(this, 'right_eyebrow', 8);
        const left_ear = new Part(this, 'left_ear');
        const left_eye = new Part(this, 'left_eye', 8);
        const left_eyebrow = new Part(this, 'left_eyebrow', 8);
        const nose = new Part(this, 'nose', 8);
        const mouth = new Part(this, 'mouth', 8);

        const left_arm = new Part(this, 'left_arm', -1);
        const left_forearm = new Part(this, 'left_forearm');
        const left_hand = new Part(this, 'left_hand');

        const right_arm = new Part(this, 'right_arm', 1);
        const right_forearm = new Part(this, 'right_forearm', 6);
        const right_hand = new Part(this, 'right_hand', 7);

        const left_thigh = new Part(this, 'left_thigh', -1);
        const left_leg = new Part(this, 'left_leg');
        const left_foot = new Part(this, 'left_foot');

        const right_thigh = new Part(this, 'right_thigh');
        const right_leg = new Part(this, 'right_leg');
        const right_foot = new Part(this, 'right_foot');

        head.AddChild(right_ear);
        head.AddChild(right_eye);
        head.AddChild(right_eyebrow);
        head.AddChild(left_ear);
        head.AddChild(left_eye);
        head.AddChild(left_eyebrow);
        head.AddChild(nose);
        head.AddChild(mouth);
        body.AddChild(head);

        // Left arm
        left_forearm.AddChild(left_hand);
        left_arm.AddChild(left_forearm);
        body.AddChild(left_arm);
        // Right arm
        right_forearm.AddChild(right_hand);
        right_arm.AddChild(right_forearm);
        body.AddChild(right_arm);
        // Left leg
        left_leg.AddChild(left_foot);
        left_thigh.AddChild(left_leg);
        body.AddChild(left_thigh);
        // Right leg
        right_leg.AddChild(right_foot);
        right_thigh.AddChild(right_leg);
        body.AddChild(right_thigh);

        this.firstPart = body;
    }

    /**
     * @param {AnimationsName} animation
     */
    SetAnimation = async (animation) => {
        if (this.animating === animation) return;

        const { settings, poses } = ANIMATIONS[animation];
        const { loop, sync } = settings;

        const applyAnim = async (index) => {
            if (this.animating !== animation) return;
            const { sleep, duration, translation, rotations } = poses[index];
            await Sleep(sleep);
            this.__applyAnimation(translation, rotations, duration);
            if (sync) await Sleep(duration);
        }

        this.animating = animation;
        while (this.animating === animation) {
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

    /**
     * Stop current animation
     */
    StopAnimation = () => {
        this.animating = false;
        if (this.animations !== null) {
            this.animations.stop();
            this.animations = null;
        }
    }

    /**
     * Apply animation to character 
     * @param {Object} translation
     * @param {Object} partsRotations { ..., PartsName: Animated3D, ... }
     * @param {Number} [duration=1000]
     */
    __applyAnimation = (translation, partsRotations, duration = 1000) => {
        let anims = [];

        // Rotations
        const setRotation = (partName) => anims.push(...this.rotations[partName].Update(partsRotations[partName], duration));
        Object.keys(partsRotations).map(setRotation);

        // Translation
        const pos = { x: translation?.x || 0, y: translation?.y || 0 };
        anims.push(TimingAnimation(this.firstPart.animPosition, pos, duration));

        this.animations = Animated.parallel(anims);
        this.animations.start();
    }

    /** @returns {JSX.Element} */
    renderItems() {
        /** @param {Part} part @returns {Array<Part>} */
        const getAllChilds = (part) => [part, ...part.childs.map(getAllChilds).flat()];
        const allParts = getAllChilds(this.firstPart).sort((a, b) => a.zIndex - b.zIndex);
        return [
            ...allParts.map(p => p.render('stuffShadow')),
            ...allParts.map(part => part.render('stuff'))
        ];
    }

    /** @returns {JSX.Element} */
    renderAll() {
        /** @param {Part} part @returns {Array<Part>} */
        const getAllChilds = (part) => [part, ...part.childs.map(getAllChilds).flat()];
        const allParts = getAllChilds(this.firstPart).sort((a, b) => a.zIndex - b.zIndex);
        return [
            ...allParts.map(p => p.render('bodyShadow')),
            ...allParts.map(p => p.render('stuffShadow')),
            ...allParts.map(part => part.render('body')),
            ...allParts.map(part => part.render('stuff'))
        ];
    }
}

export default Body;