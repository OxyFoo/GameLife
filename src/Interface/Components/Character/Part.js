import * as React from 'react';
import { Animated } from 'react-native';
import { G } from 'react-native-svg';

import { STUFFS } from '../../../../res/items/stuffs/Stuffs';
import { CHARACTERS, COLORS } from '../../../../res/items/humans/Characters';
import { CalculateParentPos } from './Utils';

/**
 * @typedef {import('./Body').default} Body
 * @typedef {import('../../../../res/items/humans/Characters').PartsName} PartsName
 */

const AnimatedG = Animated.createAnimatedComponent(G);

class Part {
    /**
     * @param {Body} body Parent body
     * @param {PartsName} name Name of body part
     * @param {number} [zIndex=0] Z-index of body part
     */
    constructor(body, name, zIndex = 0) {
        this.body = body;
        this.name = name;
        this.zIndex = zIndex;

        // Initial position from parent
        const SEXE = this.body.character.sexe;
        const character = this.body.character.skin;
        const offsets = CHARACTERS[SEXE][character]['offsets'][this.name];
        this.l = offsets[0];
        this.a = offsets[1];

        // Current absolute position
        this.position = this.name === 'bust' ? this.body.position : { x: 0, y: 0 };
        this.rotation = this.body.rotations.hasOwnProperty(this.name) ? this.body.rotations[this.name] : { rX: 0, rY: 0, rZ: 0 };
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
     * @param {'body'|'bodyShadow'|'stuff'|'stuffShadow'} partType
     * @returns {JSX.Element}
     */
    render(partType) {
        const SEXE = this.body.character.sexe;
        const SKIN = this.body.character.skin;

        if (!CHARACTERS.hasOwnProperty(SEXE)) return null;
        if (!CHARACTERS[SEXE].hasOwnProperty(SKIN)) return null;
        if (!CHARACTERS[SEXE][SKIN]['svg'].hasOwnProperty(this.name)) return null;

        const fill = COLORS[this.body.character.skinColor];
        if (!this.valuesTest) {
            this.valuesTest = CalculateParentPos.bind(this)();
        }
        const { posX, posY, rotZ } = this.valuesTest;

        const styleZIndex = { zIndex: this.zIndex, elevation: this.zIndex };
        const styleZIndexShadow = { zIndex: this.zIndex - 1000, elevation: this.zIndex - 1000 };
        const animRotation = rotZ.interpolate({ inputRange: [-360, 360], outputRange: ['-360deg', '360deg'] });
        const transforms = { transform: [
            { translateX: posX },
            { translateY: posY },
            { rotateZ: animRotation }
        ]};

        const character = CHARACTERS[SEXE][SKIN];
        const svgCharacter = character['svg'][this.name];
        const svgCharacterShadow = character['shadow'][this.name];

        let svgItems = [];
        let svgItemsShadows = [];

        const inventoryItems = this.body.character.items;
        for (let i = 0; i < inventoryItems.length; i++) {
            const ID = inventoryItems[i];
            if (!STUFFS[SEXE].hasOwnProperty(ID)) continue;

            if (STUFFS[SEXE][ID].hasOwnProperty('svg') && STUFFS[SEXE][ID]['svg'].hasOwnProperty(this.name)) {
                svgItems.push(STUFFS[SEXE][ID]['svg'][this.name]);
            }
            if (STUFFS[SEXE][ID].hasOwnProperty('shadow') && STUFFS[SEXE][ID]['shadow'].hasOwnProperty(this.name)) {
                svgItemsShadows.push(STUFFS[SEXE][ID]['shadow'][this.name]);
            }
        }

        if (partType === 'body') {
            return (
                <AnimatedG
                    key={`part-${this.name}`}
                    style={[transforms, styleZIndex]}
                    fill={fill || 'white'}
                >
                    {svgCharacter}
                </AnimatedG>
            );
        } else if (partType === 'bodyShadow') {
            return (
                <AnimatedG
                    key={`part-shadow-${this.name}`}
                    style={[transforms, styleZIndexShadow]}
                    stroke='#000000'
                    strokeWidth={4 * 2}
                >
                    {svgCharacterShadow}
                </AnimatedG>
            );
        } else if (partType === 'stuff') {
            if (svgItems.length === 0) return null;

            return (
                <AnimatedG
                    key={`stuff-${this.name}`}
                    style={[transforms, styleZIndex]}
                >
                    {svgItems.map((SVG, i) => <G key={`stuff-${this.name}-${i}`}>{SVG}</G>)}
                </AnimatedG>
            );
        } else if (partType === 'stuffShadow') {
            if (svgItemsShadows.length === 0) return null;

            return (
                <AnimatedG
                    key={`stuff-shadow-${this.name}`}
                    style={[transforms, styleZIndexShadow]}
                    stroke='#000000'
                    strokeWidth={4 * 2}
                >
                    {svgItemsShadows.map((shadow, i) => <G key={`stuff-shadow-${this.name}-${i}`}>{shadow}</G>)}
                </AnimatedG>
            );
        }
    }
}

function RP(props) {
    let [ active, setActive ] = React.useState(false);
    React.useEffect(() => {
        let isMounted = true;

        setTimeout(() => {
            if (isMounted) setActive(true);
        }, 100 + Math.random() * 1000);

        return () => {
            isMounted = false;
        }
    }, [active]);
    return !active ? null : props.part?.render(props.partType);
}
const RenderPart = React.memo(RP, (prevProps, nextProps) => false);

export { RenderPart };
export default Part;