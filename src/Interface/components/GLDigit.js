import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

import { range } from '../../Functions/Functions';
import { TimingAnimation, SpringAnimation } from '../../Functions/Animations';

import GLText from './GLText';

const STEP = 17;

class GLDigit extends React.Component {
    state = {
        animLeft: new Animated.Value(0)
    }

    componentDidMount() {
        const maxValue = this.props.lock ? 0 : (this.props.maxValue || 7);
        const initValue = Math.min(this.props.initValue || 0, maxValue);

        this.setDigitsPosX(STEP * initValue);
        this.curr_posX = 0;
    }

    swipe_start = (event) => {
        const posX = event.nativeEvent.pageX;
        this.first_posX = posX;
        this.init_posX = this.curr_posX;
    }
    swipe_move = (event) => {
        const posX = event.nativeEvent.pageX;
        const newPosX = this.curr_posX + (this.first_posX - posX);
        if (newPosX) {
            this.init_posX = newPosX;
            TimingAnimation(this.state.animLeft, this.init_posX, 0, false).start();
        }
    }
    swipe_end = (event) => {
        if (this.props.lock) {
            this.setDigitsPosX(this.curr_posX);
            return;
        }

        let min_index = -1;
        let min_delta = -1;
        for (let i = 0; i <= this.props.maxValue; i++) {
            const delta = Math.abs(this.init_posX - i*STEP);
            if (min_delta == -1 || delta < min_delta) {
                min_index = i;
                min_delta = delta;
            }
        }
        if (min_index >= 0) this.setDigitsPosX(STEP * min_index);
        else this.setDigitsPosX(0);

        const func = this.props.callback;
        if (typeof(func) === 'function') {
            const index = this.props.index || 0;
            func(index, min_index);
        }
    }

    setDigitsPosX(posX) {
        SpringAnimation(this.state.animLeft, posX, false).start();
        this.curr_posX = posX;
    }

    render() {
        const style = [ styles.containerStyle, this.props.containerStyle ];
        const color = this.props.color || 'main';
        const maxValue = this.props.lock ? 0 : this.props.maxValue;

        return (
            <View
                onTouchStart={this.swipe_start}
                onTouchMove={this.swipe_move}
                onTouchEnd={this.swipe_end}
                activeOpacity={.5}
                style={style}
            >
                <Animated.View style={[
                    styles.content,
                    {
                        transform: [{
                            translateX: Animated.subtract(0, this.state.animLeft)
                        }]
                    }
                ]}>
                    {range(maxValue).map((i) => (
                        <GLText key={'text-' + i} title={this.props.lock ? this.props.initValue : i} style={styles.textButton} color={color} />
                    ))}
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerStyle: {
        width: 38,
        height: 32,
        paddingLeft: 8,
        justifyContent: 'center',

        borderColor: '#FFFFFF',
        borderWidth: 2,
        overflow: 'hidden'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textButton: {
        marginHorizontal: 4,
        fontSize: 22
    }
});

export default GLDigit;