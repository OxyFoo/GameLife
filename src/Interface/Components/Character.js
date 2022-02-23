import * as React from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import Svg from 'react-native-svg';

import Character_Classic from '../../../res/stuffs/humans/human_classic';
import Character_Male_Test from '../../../res/stuffs/humans/human_male_test';

import { TimingAnimation, WithFunction } from '../../Utils/Animations';

class Part {
    /**
     * @param {String} name Name of body part
     * @param {Number} l Distance from parent in pixels (for initial position)
     * @param {Number} a Angle distance from parent in degrees (for initial position)
     * @param {Animated.Value} rotation Rotation of body part in degrees
     * @param {Number} [zIndex=0] Z-index of body part
     */
    constructor(name, l, a, rotation, zIndex = 0) {
        this.name = name;
        this.zIndex = zIndex;

        // Initial position from parent
        this.l = l;
        this.a = a;
        //this.r = 0;

        // Current absolute position
        this.rotation = rotation;
        this.pos = new Animated.ValueXY({ x: 0, y: 0 });

        /** @type {Part} */
        this.parent = null;

        /** @type {Array<Part>} part */
        this.childs = [];
    }

    /**
     * @param {Animated.ValueXY} position Position of body part in pixels (x, y)
     */
    SetPosition(position) {
        this.pos = position;
    }

    /**
     * @param {Part} child 
     */
    AddChild(child) {
        child.parent = this;
        this.childs.push(child);
    }
    /**
     * @param {String} name
     * @returns {Part?}
     */
    GetChild(name) {
        return this.childs.find(part => part.name === name) || null;
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

    render() {
        //const TETA = this.a * Math.PI / 180;
        //let posX = Animated.add(this.pos.x, this.l * Math.cos(TETA));
        //let posY = Animated.add(this.pos.y, this.l * Math.sin(TETA));
        //let rot = this.rotation;
        //console.log(this.name, this.pos, this.rotation);

        /*if (this.parent !== null) {
            const TETA = (this.parent.r + this.a) * Math.PI / 180;
            posX = Animated.add(posX, this.l * Math.cos(TETA));
            posY = Animated.add(posY, this.l * Math.sin(TETA));
            //this.r += this.parent.r;
        }*/

        /*let el = this;
        while (el.parent !== null) {
            let totalRotation = Animated.add(el.a, el.parent.rotation);
            totalRotation = Animated.add(totalRotation, el.parent.a);
            const TETA = Animated.multiply(totalRotation, Math.PI / 180);

            const COS = TETA.interpolate(WithFunction(Math.cos, 20, 2*Math.PI));
            const SIN = TETA.interpolate(WithFunction(Math.sin, 20, 2*Math.PI));
            const radiusX = Animated.multiply(this.l, COS);
            const radiusY = Animated.multiply(this.l, SIN);

            posX = Animated.add(posX, radiusX);
            posY = Animated.add(posY, radiusY);
            posX = Animated.add(posX, el.parent.pos.x);
            posY = Animated.add(posY, el.parent.pos.y);

            const parentRotation = Animated.add(el.parent.a, el.parent.rotation);
            rot = Animated.add(rot, el.r);
            rot = Animated.add(rot, parentRotation);
            el = el.parent;
        }*/
        /*const calculateParentPos = (el) => {
            if (el.parent !== null) {
                const totalRotation = Animated.add(el.a, el.parent.rotation);
                const TETA = Animated.multiply(totalRotation, Math.PI / 180);

                const COS = TETA.interpolate(WithFunction(Math.cos, 20, 2*Math.PI));
                const SIN = TETA.interpolate(WithFunction(Math.sin, 20, 2*Math.PI));
                const radiusX = Animated.multiply(this.l, COS);
                const radiusY = Animated.multiply(this.l, SIN);

                const X = Animated.add(el.parent.pos.x, radiusX);
                const Y = Animated.add(el.parent.pos.y, radiusY);

                const parentRotation = Animated.add(el.parent.a, el.parent.rotation);
                R = Animated.add(parentRotation, el.r);
                return [ X, Y, R ];

                calculateParentPos(el.parent);
            }
        }*/



        let posX = this.pos.x;
        let posY = this.pos.y;
        let rotZ = this.rotation;

        /** @param {Part} el */
        const calculateParentPos = (el) => {
            if (el.parent !== null) {
                const parentRotation = Animated.modulo(Animated.add(el.parent.rotation, el.parent.a), 360);
                //const totalRotation = Animated.modulo(Animated.add(parentRotation, el.a), 360);
                const totalRotation = Animated.modulo(Animated.add(el.parent.rotation, el.a), 360);

                let _totalRotation = new Animated.Value(0);
                const elChilds = el.getParents();
                for (let i = 0; i < elChilds.length-1; i++) {
                    const child = elChilds[i];
                    const childRotation = Animated.add(child.a % 360, child.rotation);
                    _totalRotation = Animated.add(_totalRotation, childRotation);
                }
                _totalRotation = Animated.add(_totalRotation, el.a);
                _totalRotation = Animated.modulo(_totalRotation, 360);

                const TETA = Animated.multiply(_totalRotation, Math.PI / 180);
                const COS = TETA.interpolate(WithFunction(Math.cos, 20, 2*Math.PI));
                const SIN = TETA.interpolate(WithFunction(Math.sin, 20, 2*Math.PI));
                const radiusX = Animated.multiply(el.l, COS);
                const radiusY = Animated.multiply(el.l, SIN);

                const parentX = Animated.add(el.parent.pos.x, radiusX);
                const parentY = Animated.add(el.parent.pos.y, radiusY);

                posX = Animated.add(posX, parentX);
                posY = Animated.add(posY, parentY);
                rotZ = Animated.add(rotZ, parentRotation);

                calculateParentPos(el.parent);
            }
        }
        calculateParentPos(this);

        const character = (
            <Character_Male_Test
                key={'part-' + this.name + '-' + Math.random()}
                part={this.name}
                fill='#e0a98b'
                posX={posX}
                posY={posY}
                rotation={rotZ}
                zIndex={this.zIndex}
            />
        );

        if (this.name !== 'bust') return character;

        /** @param {Part} part */
        const allRender = (part) => part == this ? character : part.render();
        // TODO - Now: show only this and childs, but in future: show all parts from bust
        const components = [this, ...this.childs].sort((a, b) => a.zIndex - b.zIndex).map(allRender);
        return (components);
    }
}

const CharacterProps = {
}

class Character extends React.Component {
    state = {
        positions: {
            bust: new Animated.ValueXY({ x: 0, y: 0 })
        },
        rotations: {
            bust: new Animated.Value(0),
            head: new Animated.Value(0),
            left_arm: new Animated.Value(0),
            left_forearm: new Animated.Value(-130),
            left_hand: new Animated.Value(20),
            right_arm: new Animated.Value(0),
            right_forearm: new Animated.Value(-20),
            right_hand: new Animated.Value(-20),
            left_thigh: new Animated.Value(0),
            left_leg: new Animated.Value(0),
            left_foot: new Animated.Value(0),
            right_thigh: new Animated.Value(0),
            right_leg: new Animated.Value(0),
            right_foot: new Animated.Value(0)
        }
    }

    constructor(props) {
        super(props);

        const pos = this.state.positions;
        const rot = this.state.rotations;
        this.pos = { x: 450, y: 280 };
        pos.bust.addListener(this.__setPosition.bind(this));

        this.body = new Part('bust', 0, 0, rot.bust, 1);
        this.body.SetPosition(pos.bust);
        const head = new Part('head', 0, 0, rot.head, 2);

        const left_arm = new Part('left_arm', 100, 135, rot.left_arm, 2);
        const left_forearm = new Part('left_forearm', 120, -25, rot.left_forearm, 2);
        const left_hand = new Part('left_hand', 100, 105, rot.left_hand, 5);

        const right_arm = new Part('right_arm', 110, 30, rot.right_arm, -1);
        const right_forearm = new Part('right_forearm', 140, 40, rot.right_forearm);
        const right_hand = new Part('right_hand', 90, 25, rot.right_hand);

        const left_thigh = new Part('left_thigh', 0, 0, rot.left_thigh);
        const left_leg = new Part('left_leg', 0, 0, rot.left_leg);
        const left_foot = new Part('left_foot', 0, 0, rot.left_foot);
        const right_thigh = new Part('right_thigh', 0, 0, rot.right_thigh);
        const right_leg = new Part('right_leg', 0, 0, rot.right_leg);
        const right_foot = new Part('right_foot', 0, 0, rot.right_foot);

        this.body.AddChild(head);
        // Left arm
        left_forearm.AddChild(left_hand);
        left_arm.AddChild(left_forearm);
        this.body.AddChild(left_arm);
        // Right arm
        right_forearm.AddChild(right_hand);
        right_arm.AddChild(right_forearm);
        this.body.AddChild(right_arm);
        // Left leg
        //left_leg.AddChild(left_foot);
        //left_thigh.AddChild(left_leg);
        //this.body.AddChild(left_thigh);
        // Right leg
        //right_leg.AddChild(right_foot);
        //right_thigh.AddChild(right_leg);
        //this.body.AddChild(right_thigh);

        //this.character = this.body.render();
    }

    componentDidMount() {
        //const angles = [ 0, 90, -10, 0, -20, 40, 20, -25, -30, 0, -20, -40, 0 ];
        //const angles = [ 20, 40, 0, -20, -40, 40, 60, -25, -30, 0, -20, -40, 0 ];
        this.SetPartRotation('head', 10, 1000);
        this.SetPositionAbsolute(this.pos.x, this.pos.y, 0);

        const ToIdle = () => {
            this.SetPartRotation('bust', 0, 1000);
            this.SetPartRotation('head', 0, 1000);
            this.SetPartRotation('left_arm', 0, 1000);
            this.SetPartRotation('left_forearm', -130, 1000);
            this.SetPartRotation('left_hand', 20, 1000);
            this.SetPartRotation('right_arm', 0, 1000);
            this.SetPartRotation('right_forearm', -20, 1000);
            this.SetPartRotation('right_hand', -20, 1000);
            this.SetPartRotation('left_thigh', 0, 1000);
            this.SetPartRotation('left_leg', 0, 1000);
            this.SetPartRotation('left_foot', 0, 1000);
            this.SetPartRotation('right_thigh', 0, 1000);
            this.SetPartRotation('right_leg', 0, 1000);
            this.SetPartRotation('right_foot', 0, 1000);
        }

        const ToMuscles = () => {
            this.SetPartRotation('bust', 0, 1000);
            this.SetPartRotation('head', 20, 1000);
            this.SetPartRotation('left_arm', 40, 1000);
            this.SetPartRotation('left_forearm', -200, 1000);
            this.SetPartRotation('left_hand', -20, 1000);
            this.SetPartRotation('right_arm', 0, 1000);
            this.SetPartRotation('right_forearm', -20, 1000);
            this.SetPartRotation('right_hand', -20, 1000);
            this.SetPartRotation('left_thigh', 0, 1000);
            this.SetPartRotation('left_leg', 0, 1000);
            this.SetPartRotation('left_foot', 0, 1000);
            this.SetPartRotation('right_thigh', 0, 1000);
            this.SetPartRotation('right_leg', 0, 1000);
            this.SetPartRotation('right_foot', 0, 1000);
        }

        //setTimeout(ToIdle, 1000);
        setTimeout(ToMuscles, 100);

        return;
        setTimeout(() => this.SetPartRotation('left_arm', 400, 750), 1000);
        setTimeout(() => this.SetPartRotation('left_forearm', -20, 750), 2000);
        setTimeout(() => this.SetPartRotation('bust', -20, 750), 3000);
        //setTimeout(() => this.SetPartRotation('left_hand', -20, 750), 4000);
        //setTimeout(() => this.SetPositionRelative(150, 150), 4000);
    }

    SetPositionAbsolute(x, y, duration = 1000) {
        TimingAnimation(this.state.positions.bust, { x, y }, duration).start();
    }
    SetPositionRelative(x, y, duration = 1000) {
        const newX = this.pos.x + x;
        const newY = this.pos.y + y;
        TimingAnimation(this.state.positions.bust, { x: newX, y: newY }, duration).start();
    }
    __setPosition({ x, y }) {
        this.pos = { x, y };
    }

    /**
     * @param {'bust'|'head'|'left_arm'|'left_forearm'|'left_hand'|'right_arm'|'right_forearm'|'right_hand'|'left_thigh'|'left_leg'|'left_foot'|'right_thigh'|'right_leg'|'right_foot'} partName
     * @param {Number} angle Rotations of body part
     */
    SetPartRotation = (partName, angle = 0, duration = 1000) => {
        if (!Object.keys(this.state.rotations).includes(partName)) {
            console.warn('Character: Wrong part name');
            return;
        }
        TimingAnimation(this.state.rotations[partName], angle, duration).start();
    }

    render() {
        return (
            <View style={styles.canvas}>
                <Svg viewBox='0 0 1000 1000'>
                    {this.body.render()}
                </Svg>
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