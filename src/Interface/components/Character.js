import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Character_Classic from '../../../res/stuffs/humans/human_classic';

class Part {
    /**
     * @param {String} name Name of body part (used for keys)
     * @param {Number} l Distance from parent in pixels
     * @param {Number} a Angle distance from parent in degrees
     * @param {Number} r Rotation of body part in degrees
     * @param {Number} x Initial position in pixels (first part)
     * @param {Number} y Initial position in pixels (first part)
     */
    constructor(name, l = 0, a = 0, r = 0, x = 0, y = 0) {
        this.name = name;
        this.l = l;
        this.a = a;
        this.r = r;

        this.x = x;
        this.y = y;

        /**
         * @type {Part[]} part
         */
        this.childs = [];
    }

    /**
     * @param {Part} parent
     * @returns Render result
     */
    render(parent = null) {
        if (parent !== null) {
            const TETA = (parent.r + this.a) * Math.PI / 180;
            this.x += parent.x + this.l * Math.cos(TETA);
            this.y += parent.y + this.l * Math.sin(TETA);
            this.r += parent.r;
        }

        const childrens = this.childs.map(part => part.render(this));

        return (
            <View key={'part-' + this.name} style={styles.part}>
                <Character_Classic
                    part={this.name}
                    fill='#e0a98b'
                    posX={this.x}
                    posY={this.y}
                    posR={this.r}
                />
                {childrens}
            </View>
        )
    }
}

const CharacterProps = {
}

class Character extends React.Component {
    constructor(props) {
        super(props);

        /**
         * @type {Number[3]} posX, posY, Rotation
         */
        const initPos = [ 250, 80, 10 ];

        /**
         * @type {Part[13]} Rotations of body parts
         * head, left_arm, left_forearm, left_hand, right_arm, right_forearm, right_hand, left_thigh, left_leg, left_foot, right_thigh, right_leg, right_foot
         */
        const angles = [ 0, 20, 90, 20, 30, 40, 20, -20, -30, 0, -20, -40, 0 ];

        const bust = new Part('bust', 0, 0, initPos[2], initPos[0], initPos[1]);
        const head = new Part('head', -10, 90, angles[0]);
        const left_arm = new Part('left_arm', 45, 165, angles[1]);
        const left_forearm = new Part('left_forearm', 90, 90, angles[2]);
        const left_hand = new Part('left_hand', 80, 90, angles[3]);
        const right_arm = new Part('right_arm', 45, 15, angles[4]);
        const right_forearm = new Part('right_forearm', 90, 90, angles[5]);
        const right_hand = new Part('right_hand', 80, 90, angles[6]);
        const left_thigh = new Part('left_thigh', 130, 99, angles[7]);
        const left_leg = new Part('left_leg', 125, 90, angles[8]);
        const left_foot = new Part('left_foot', 135, 90, angles[9]);
        const right_thigh = new Part('right_thigh', 130, 81, angles[10]);
        const right_leg = new Part('right_leg', 125, 90, angles[11]);
        const right_foot = new Part('right_foot', 135, 90, angles[12]);

        bust.childs.push(head);
        // Left arm
        left_forearm.childs.push(left_hand);
        left_arm.childs.push(left_forearm);
        bust.childs.push(left_arm);
        // Right arm
        right_forearm.childs.push(right_hand);
        right_arm.childs.push(right_forearm);
        bust.childs.push(right_arm);
        // Left leg
        left_leg.childs.push(left_foot);
        left_thigh.childs.push(left_leg);
        bust.childs.push(left_thigh);
        // Right leg
        right_leg.childs.push(right_foot);
        right_thigh.childs.push(right_leg);
        bust.childs.push(right_thigh);

        this.character = bust.render();
    }

    render() {
        return (
            <View style={styles.canvas}>
                {this.character}
            </View>
        );
    }
}

Character.prototype.props = CharacterProps;
Character.defaultProps = CharacterProps;

const styles = StyleSheet.create({
    canvas: {
        width: '100%',
        height: '100%'
    },
    part: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
});

export default Character;