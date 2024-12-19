import * as React from 'react';
import { Animated } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { Sleep } from '../../../src/Utils/Functions';
import { SpringAnimation } from '../../../src/Utils/Animations';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

class SvgComponent extends React.Component {
    state = {
        animation1: new Animated.Value(-40),
        animation2: new Animated.Value(-25),
        animation3: new Animated.Value(-40)
    }

    componentDidMount() {
        this.Loop();
        this.interval = window.setInterval(this.Loop, 5000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    Loop = async () => {
        await Sleep(100); SpringAnimation(this.state.animation1, -5, false).start();
        await Sleep(100); SpringAnimation(this.state.animation2, -5, false).start();
        await Sleep(100); SpringAnimation(this.state.animation3, -5, false).start();
        await Sleep(200);
        await Sleep(100); SpringAnimation(this.state.animation1, -40, false).start();
        await Sleep(100); SpringAnimation(this.state.animation2, -25, false).start();
        await Sleep(100); SpringAnimation(this.state.animation3, -40, false).start();
    }
    render() {
        return (
            <Svg viewBox='0 0 50 50' {...this.props}>
                <AnimatedRect y={50} width={13} height={this.state.animation1} fill='#C466FF'></AnimatedRect>
                <AnimatedRect x={19} y={50} width={13} height={this.state.animation2} fill='#666EFF'></AnimatedRect>
                <AnimatedRect x={38} y={50} width={13} height={this.state.animation3} fill='#66F5FF'></AnimatedRect>
            </Svg>
        )
    }
}

export default SvgComponent;
