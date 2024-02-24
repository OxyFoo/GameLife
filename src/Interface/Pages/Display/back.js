import { Animated } from 'react-native';

import { PageBase } from 'Interface/Components';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Random } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Data/Quotes').Quote} Quote
 */

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
        this.quote = null;
        this.callback = getFromProp('action', user.interface.BackHandle);

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
        super.componentDidMount();

        SpringAnimation(this.state.anim, 1).start();
    }
}

export default BackDisplay;
