/**
 * @typedef {import('./Part').default} Part
 */

class Point3D {
    constructor(x = 0, y = 0, z = 0) {
        this.rX = x;
        this.rY = y;
        this.rZ = z;
    }

    /**
     * @param {{ rX: number, rY: number, rZ: number }} angles
     */
    Update(angles) {
        if (typeof angles !== 'object') {
            throw new Error('Point3D.Update: angles must be an object');
        }

        if (angles.hasOwnProperty('rX')) this.rX = angles['rX'];
        if (angles.hasOwnProperty('rY')) this.rY = angles['rY'];
        if (angles.hasOwnProperty('rZ')) this.rZ = angles['rZ'];
    }
}

/**
 * @description Return an array of all parent parts in order from root to this part (including this part)
 * @param {Part} el
 * @returns {Array<Part>}
 */
function __getParents(el) {
    let parents = [el];
    let parent = el.parent;
    while (parent !== null) {
        parents.splice(0, 0, parent);
        parent = parent.parent;
    }
    return parents;
}

/**
 * @param {Part} part
 * @returns {{ posX: number, posY: number, rotZ: number }}
 */
function CalculateParentPos(part) {
    let posX = part.position.x;
    let posY = part.position.y;
    let rotZ = part.rotation.rZ;

    /** @param {Part} el */
    const calculateParentPos = (el) => {
        if (el.parent !== null) {
            let currentRotation = 0;
            const elChilds = __getParents(el);
            for (let i = 0; i < elChilds.length - 1; i++) {
                const child = elChilds[i];
                const childRotation = (child.a % 360) + child.rotation.rZ;
                currentRotation += childRotation;
            }
            currentRotation += el.a;
            currentRotation %= 360;

            const TETA = currentRotation * (Math.PI / 180);
            const radiusX = el.l * Math.cos(TETA);
            const radiusY = el.l * Math.sin(TETA);

            const parentX = el.parent.position.x + radiusX;
            const parentY = el.parent.position.y + radiusY;
            const parentR = el.parent.rotation.rZ % 360;

            posX = posX + parentX;
            posY = posY + parentY;
            rotZ = rotZ + parentR;

            calculateParentPos(el.parent);
        }
    };
    calculateParentPos(part);

    posX += part.body.position.x;
    posY += part.body.position.y;

    return { posX, posY, rotZ };
}

export { Point3D, CalculateParentPos };
