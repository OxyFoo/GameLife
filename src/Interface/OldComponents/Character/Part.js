import * as React from 'react';
import { G } from 'react-native-svg';

import { CalculateParentPos, Point3D } from './Utils';
import { STUFFS } from 'Ressources/items/stuffs/Stuffs';
import { CHARACTERS, COLORS } from 'Ressources/items/humans/Characters';

/**
 * @typedef {import('./Body').default} Body
 * @typedef {import('Ressources/items/humans/Characters').PartsName} PartsName
 * 
 * @typedef {'bodyShadow' | 'stuffShadow' | 'body' | 'stuff'} CharacterRenderTypes
 */

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
        this.laChanged = false;
        this.updateOffsets();

        // Current absolute position
        this.position = { x: 0, y: 0 };
        this.rotation = new Point3D();

        /** @type {Part} */
        this.parent = null;

        /** @type {Array<Part>} part */
        this.childs = [];
    }

    updateOffsets() {
        const SEXE = this.body.character.sexe;
        const character = this.body.character.skin;
        const offsets = CHARACTERS[SEXE][character]['offsets'][this.name];
        this.l = offsets[0];
        this.a = offsets[1];
        this.laChanged = true;
    }

    /**
     * @param {Part} child 
     */
    AddChild(child) {
        child.parent = this;
        this.childs.push(child);
    }

    /**
     * @param {CharacterRenderTypes} partType
     * @returns {JSX.Element}
     */
    render(partType) {
        const SEXE = this.body.character.sexe;
        const SKIN = this.body.character.skin;

        if (!CHARACTERS.hasOwnProperty(SEXE)) return null;
        if (!CHARACTERS[SEXE].hasOwnProperty(SKIN)) return null;
        if (!CHARACTERS[SEXE][SKIN]['svg'].hasOwnProperty(this.name)) return null;

        const fill = COLORS[this.body.character.skinColor];
        if (!this.valuesTest || this.laChanged) {
            this.valuesTest = CalculateParentPos(this);
        }
        const { posX, posY, rotZ } = this.valuesTest;

        const styleZIndex = { zIndex: this.zIndex, elevation: this.zIndex };
        const styleZIndexShadow = { zIndex: this.zIndex - 1000, elevation: this.zIndex - 1000 };

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
                <G
                    translateX={posX}
                    translateY={posY}
                    rotation={rotZ}
                    key={`part-${this.name}`}
                    // @ts-ignore
                    style={styleZIndex}
                    fill={fill || 'white'}
                >
                    {svgCharacter}
                </G>
            );
        } else if (partType === 'bodyShadow') {
            return (
                <G
                    translateX={posX}
                    translateY={posY}
                    rotation={rotZ}
                    key={`part-shadow-${this.name}`}
                    // @ts-ignore
                    style={styleZIndexShadow}
                    stroke='#000000'
                    strokeWidth={4 * 2}
                >
                    {svgCharacterShadow}
                </G>
            );
        } else if (partType === 'stuff') {
            if (svgItems.length === 0) return null;

            return (
                <G
                    translateX={posX}
                    translateY={posY}
                    rotation={rotZ}
                    key={`stuff-${this.name}`}
                    // @ts-ignore
                    style={styleZIndex}
                >
                    {svgItems.map((SVG, i) => <G key={`stuff-${this.name}-${i}`}>{SVG}</G>)}
                </G>
            );
        } else if (partType === 'stuffShadow') {
            if (svgItemsShadows.length === 0) return null;

            return (
                <G
                    translateX={posX}
                    translateY={posY}
                    rotation={rotZ}
                    key={`stuff-shadow-${this.name}`}
                    // @ts-ignore
                    style={styleZIndexShadow}
                    stroke='#000000'
                    strokeWidth={4 * 2}
                >
                    {svgItemsShadows.map((shadow, i) => <G key={`stuff-shadow-${this.name}-${i}`}>{shadow}</G>)}
                </G>
            );
        }
    }
}

export default Part;
