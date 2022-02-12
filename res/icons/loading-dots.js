import * as React from 'react';
import { Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { Sleep } from '../../src/Utils/Functions';
import { TimingAnimation } from '../../src/Utils/Animations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

class SvgComponent extends React.Component {
    state = {
        animation1: new Animated.Value(1),
        animation2: new Animated.Value(1),
        animation3: new Animated.Value(1)
    }

    componentDidMount() {
        this.Loop();
        this.interval = setInterval(this.Loop, 1200);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    Loop = async () => {
        await Sleep(150); TimingAnimation(this.state.animation1, 0.2, 250, false).start();
        await Sleep(150); TimingAnimation(this.state.animation2, 0.2, 250, false).start();
        await Sleep(150); TimingAnimation(this.state.animation3, 0.2, 250, false).start();

        await Sleep(150); TimingAnimation(this.state.animation1, 1, 250, false).start();
        await Sleep(150); TimingAnimation(this.state.animation2, 1, 250, false).start();
        await Sleep(150); TimingAnimation(this.state.animation3, 1, 250, false).start();
    }

    render() {
        return (
            <Svg
                viewBox='0 0 50 50'
                fill={this.props.color || 'white'}
                {...this.props}
            >
                <AnimatedCircle x={6} y={25} r={6} fillOpacity={this.state.animation1} />
                <AnimatedCircle x={25} y={25} r={6} fillOpacity={this.state.animation2} />
                <AnimatedCircle x={44} y={25} r={6} fillOpacity={this.state.animation3} />
            </Svg>
        )
    }
}

export default SvgComponent;