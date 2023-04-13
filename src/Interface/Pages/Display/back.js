import { Animated } from 'react-native';

import { PageBack } from '../../Components';
import user from '../../../Managers/UserManager';

import { SpringAnimation } from '../../../Utils/Animations';

class BackDisplay extends PageBack {
    state = {
        anim: new Animated.Value(.5)
    };

    constructor(props) {
        super(props);

        const getFromProp = (key, defaultVal = '') => {
            if (this.props.args.hasOwnProperty(key))
                return this.props.args[key];
            return defaultVal;
        }

        this.icon = getFromProp('icon');
        this.text = getFromProp('text');
        this.button = getFromProp('button');
    }

    componentDidMount() {
        SpringAnimation(this.state.anim, 1).start();
    }

    Back = () => {
        user.interface.BackPage();
    }
}

export default BackDisplay;