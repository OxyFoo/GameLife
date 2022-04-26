import * as React from 'react';
import { Animated } from 'react-native';
import { G } from 'react-native-svg';

import user from '../../../Managers/UserManager';

import { WithFunction } from '../../../Utils/Animations';
import { STUFFS } from '../../../../res/items/stuffs/Stuffs';
import { CHARACTERS } from '../../../../res/items/humans/Characters';

/**
 * @typedef {import('./Body').default} Body
 * @typedef {import('./Character').PartsName} PartsName
 */

const AnimatedG = Animated.createAnimatedComponent(G);

class Part {
    /**
     * @param {Body} body Parent body
     * @param {keyof PartsName} name Name of body part
     * @param {Number} [zIndex=0] Z-index of body part
     */
    constructor(body, name, zIndex = 0) {
        this.body = body;
        this.name = name;
        this.zIndex = zIndex;

        // Initial position from parent
        const character = this.body.character.skin;
        const offsets = CHARACTERS[character]['offsets'][this.name];
        this.l = offsets[0];
        this.a = offsets[1];

        // Current absolute position
        this.position = this.name === 'bust' ? this.body.position : { x: 0, y: 0 };
        this.rotation = this.body.rotations[this.name];
        this.animPosition = new Animated.ValueXY({ x: 0, y: 0 });

        /** @type {Part} */
        this.parent = null;

        /** @type {Array<Part>} part */
        this.childs = [];
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
        let posX = this.position.x;
        let posY = this.position.y;
        let rotZ = this.body.rotations[this.name].rZ;

        /** @param {Part} el */
        const calculateParentPos = (el) => {
            if (el.parent !== null) {
                let currentRotation = new Animated.Value(0);
                const elChilds = el.getParents();
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
                const parentR = Animated.modulo(Animated.add(el.parent.rotation.rZ, el.parent.a), 360);

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

    /**
     * @param {'body'|'shadow'|'stuff'} partType
     * @returns {JSX.Element}
     */
    render(partType) {
        const character = this.body.character.skin;
        if (!CHARACTERS.hasOwnProperty(character)) return null;
        if (!CHARACTERS[character]['svg'].hasOwnProperty(this.name)) return null;

        const fill = '#e0a98b';
        const { posX, posY, rotZ } = this.calculateParentPos();

        const styleZIndex = { zIndex: this.zIndex, elevation: this.zIndex };
        const styleZIndexShadow = { zIndex: this.zIndex - 1000, elevation: this.zIndex - 1000 };
        const animRotation = rotZ.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'] });
        const transforms = { transform: [
            { translateX: posX },
            { translateY: posY },
            { rotateZ: animRotation }
        ]};

        let SVGs = [ CHARACTERS[character]['svg'][this.name] ];
        let shadows = [ CHARACTERS[character]['shadows'][this.name] ];

        const inventoryItems = user.inventory.equipments;
        for (const slot in inventoryItems) {
            const ID = inventoryItems[slot];
            if (ID === null) continue;
            if (!STUFFS.hasOwnProperty(ID)) continue;

            if (STUFFS[ID].hasOwnProperty('svg') && STUFFS[ID]['svg'].hasOwnProperty(this.name)) {
                SVGs.push(STUFFS[ID]['svg'][this.name]);
            }
            if (STUFFS[ID].hasOwnProperty('shadows') && STUFFS[ID]['shadows'].hasOwnProperty(this.name)) {
                shadows.push(STUFFS[ID]['shadows'][this.name]);
            }
        }

        if (partType === 'body') {
            return (
                <AnimatedG
                    key={`part-${this.name}`}
                    style={[transforms, styleZIndex]}
                    fill={fill || 'white'}
                >
                    {SVGs.map((SVG, i) => <G key={'part' + i}>{SVG}</G>)}
                </AnimatedG>
            );
        } else if (partType === 'shadow') {
            return (
                <AnimatedG
                    key={`part-shadow-${this.name}`}
                    style={[transforms, styleZIndexShadow]}
                    //fill={fill || 'white'}
                    stroke='#000000'
                    strokeWidth={4 * 2}
                >
                    {shadows.map((shadow, i) => <G key={'part' + i}>{shadow}</G>)}
                </AnimatedG>
            );
        } else if (partType === 'stuff') {
        }
    }
}

export default Part;