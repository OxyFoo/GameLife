import { Animated } from 'react-native';

import { PageBack } from 'Interface/Components';
import user from 'Managers/UserManager';

import { SpringAnimation } from 'Utils/Animations';

class BackDisplay extends PageBack {
    state = {
        anim: new Animated.Value(.5)
    };

    constructor(props) {
        super(props);

        /**
         * 
         * @param {string} key
         * @param {any} defaultVal
         * @returns 
         */
        const getFromProp = (key, defaultVal = '') => {
            if (this.props.args.hasOwnProperty(key))
                return this.props.args[key];
            return defaultVal;
        }

        this.icon = getFromProp('icon');
        this.iconRatio = getFromProp('iconRatio', 0.8);
        this.text = getFromProp('text');
        this.button = getFromProp('button');
        this.callback = getFromProp('action', user.interface.BackHandle);
    }

    componentDidMount() {
        super.componentDidMount();

        SpringAnimation(this.state.anim, 1).start();
    }
}

export default BackDisplay;