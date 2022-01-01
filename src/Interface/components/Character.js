import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Character_Classic from '../../../res/stuffs/humans/human_classic';

const CharacterProps = {
}

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

class Character extends React.Component {
    constructor(props) {
        super(props);

        const bust = new Part('bust', 0, 0, 10, 250, 80);
        const head = new Part('head', -10, 90, 0);
        const left_arm = new Part('left_arm', 45, 165, 20);
        const left_forearm = new Part('left_forearm', 90, 90, 90);
        const left_hand = new Part('left_hand', 80, 90, 20);
        const right_arm = new Part('right_arm', 45, 15, 30);
        const right_forearm = new Part('right_forearm', 90, 90, 40);
        const right_hand = new Part('right_hand', 80, 90, 20);
        const left_thigh = new Part('left_thigh', 130, 99, -20);
        const left_leg = new Part('left_leg', 125, 90, -30);
        const left_foot = new Part('left_foot', 135, 90, 0);
        const right_thigh = new Part('right_thigh', 130, 81, -20);
        const right_leg = new Part('right_leg', 125, 90, -40);
        const right_foot = new Part('right_foot', 135, 90, 0);

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

        this.character = bust.render()
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