import { Animated } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Random } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Data/Quotes').Quote} Quote
 */

const BackDisplayProps = {
    args: {
        /** @type {string} */
        icon: '',

        /** @type {number} */
        iconRatio: 0.8,

        /** @type {string} */
        text: '',

        /** @type {string} */
        button: '',

        /** @type {string} */
        button2: '',

        /** @type {Quote} */
        quote: null,

        /** @type {() => void} */
        action: () => {},

        /** @type {() => void} */
        action2: () => {}
    }
};

class BackDisplay extends PageBase {
    state = {
        anim: new Animated.Value(.5)
    }

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
        this.button2 = getFromProp('button2');
        this.quote = null;
        this.callback = getFromProp('action', user.interface.BackHandle);
        this.callback2 = getFromProp('action2', user.interface.BackHandle);

        /** @type {Quote | null} */
        const quoteItem = getFromProp('quote', null);
        const anonymousAuthors = langManager.curr['quote']['anonymous-author-list'];
        if (quoteItem !== null) {
            this.quote = {
                text: langManager.GetText(quoteItem.Quote),
                author: quoteItem.Author || anonymousAuthors[Random(0, anonymousAuthors.length)]
            };
        }
    }

    componentDidMount() {
        SpringAnimation(this.state.anim, 1).start();
    }
}

BackDisplay.defaultProps = BackDisplayProps;
BackDisplay.prototype.props = BackDisplayProps;

export default BackDisplay;
