import { Animated } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Random } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {import('Data/Quotes').Quote} Quote
 */

const BackDisplayProps = {
    args: {
        /** @type {IconsName} */
        icon: 'default',

        /** @type {number} */
        iconRatio: 0.8,

        /** @type {string} */
        text: '',

        /** @type {string} */
        button: '',

        /** @type {string} */
        button2: '',

        /** @type {Quote | null | undefined} */
        quote: null,

        /** @type {() => void | undefined} */
        action: () => {},

        /** @type {() => void | undefined} */
        action2: () => {}
    }
};

class BackDisplay extends PageBase {
    state = {
        anim: new Animated.Value(.5)
    }

    /** @param {BackDisplayProps} props */
    constructor(props) {
        super(props);

        this.quote = null;
        this.callback = this.props.args.action ?? user.interface.BackHandle;
        this.callback2 = this.props.args.action2 ?? user.interface.BackHandle;

        const quoteItem = this.props.args.quote;
        const anonymousAuthors = langManager.curr['quote']['anonymous-author-list'];
        if (!!quoteItem) {
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
