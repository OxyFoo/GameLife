import * as React from 'react';
import { Animated } from 'react-native';

import user from '../../Managers/UserManager';

import { SpringAnimation } from '../../Functions/Animations';

class BackDisplay extends React.Component {
    constructor(props) {
        super(props);

        const getFromProp = (key, defaultVal = '') => {
            if (this.props.args.hasOwnProperty(key)) {
                return this.props.args[key];
            }
            return defaultVal;
        }

        this.icon = getFromProp('icon');
        this.text = getFromProp('text');
        this.button = getFromProp('button');

        this.state = {
            anim: new Animated.Value(.5)
        };
    }

    componentDidMount() {
        SpringAnimation(this.state.anim, 1).start();
    }

    ToHome = () => {
        user.interface.ChangePage('home');
    }
}

export default BackDisplay;