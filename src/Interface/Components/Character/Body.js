import Part from './Part';

/**
 * @typedef {import('./Frame').BodyView} BodyView
 * @typedef {import('./Character').default} Character
 */

class Body {
    /**
     * @param {Character} character Parent character
     */
    constructor(character) {
        this.character = character;

        // Global position
        this.position = { x: 0, y: 0 };

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
        const left_foot = new Part(this, 'left_foot', 2);

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
     * Apply animation to character 
     * @param {object} translation
     * @param {object} partsRotations { ..., PartsName: Animated3D, ... }
     */
    __applyAnimation = (translation, partsRotations) => {
        // Rotations
        Object.keys(partsRotations).forEach((partName) => {
            const part = this
                            .getChilds(this.firstPart)
                            .find(part => part.name === partName) || null;
            part?.rotation.Update(partsRotations[partName]);
        });

        // Translation
        this.firstPart.position.x = translation?.x || 0;
        this.firstPart.position.y = translation?.y || 0;
    }

    /**
     * @param {Part} part
     * @param {BodyView} size
     * @returns {Array<Part>}
     */
    getChilds = (part, size = 'full') => {
        const head_partToRemove = 'bust';
        const topHalf_partToRemove = [
            'left_thigh',
            'right_thigh',
            'left_forearm',
            'right_forearm'
        ];

        if (size === 'head' && part.name === head_partToRemove) {
            return [ part.childs[0], ...part.childs[0].childs.map(part => this.getChilds(part, 'full')).flat() ];
        }
        else if (size === 'topHalf' && topHalf_partToRemove.includes(part.name)) {
            return [];
        }

        return [ part, ...part.childs.map(part => this.getChilds(part, size)).flat() ];
    }

    /**
     * @param {'all' | 'onlyItems'} type
     * @param {BodyView} size
     * @returns {JSX.Element[]}
     */
    render = (type = 'all', size = 'full') => {
        if (this.character.parentFrame === null) return null;
        if (this.character.outOfBounds || this.character.hide) return null;

        const allParts = this.getChilds(this.firstPart, size)
                                .sort((a, b) => a.zIndex - b.zIndex);

        if (type === 'all') {
            return [
                ...allParts.map(part => part.render('bodyShadow')),
                ...allParts.map(part => part.render('stuffShadow')),
                ...allParts.map(part => part.render('body')),
                ...allParts.map(part => part.render('stuff'))
            ];
        } else if (type === 'onlyItems') {
            return [
                ...allParts.map(part => part.render('stuffShadow')),
                ...allParts.map(part => part.render('stuff'))
            ];
        }
    }
}

export default Body;
