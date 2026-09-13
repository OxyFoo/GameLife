import { Animated } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Random } from 'Utils/Functions';
import { SpringAnimation } from 'Utils/Animations';

/**
 * @typedef {import('Ressources/Icons').IconsName} IconsName
 * @typedef {import('Data/App/Quotes').Quote} Quote
 * @typedef {import('Interface/Components/Zap/back').ZapPose} ZapPose
 * @typedef {import('Interface/Components/Zap/back').ZapOrientation} ZapOrientation
 *
 * @typedef {object} BackDisplayPropsType
 * @property {object} args
 * @property {IconsName | 'zap'} args.icon Icon to display, or `'zap'` to show Zap instead
 * @property {number} [args.iconWidth]
 * @property {ZapPose} [args.zapPose] Pose of the zap when `icon` is `'zap'`
 * @property {ZapOrientation} [args.zapOrientation] Orientation of the zap when `icon` is `'zap'`
 * @property {string} args.text
 * @property {string} args.button
 * @property {string} [args.button2]
 * @property {(() => void) | null} [args.action]
 * @property {(() => void) | null} [args.action2]
 * @property {Quote | null} [args.quote]
 * @property {React.ReactNode} [args.additionalContent]
 * @property {React.ReactNode} [args.additionalButton] Rendered above the two buttons
 */

/** @type {BackDisplayPropsType} */
const BackDisplayProps = {
    args: {
        icon: 'default',
        iconWidth: 150,
        zapPose: 'up',
        zapOrientation: 'right',
        text: '',
        button: '',

        // Optional
        button2: '',
        action: null,
        action2: null,
        quote: undefined,
        additionalContent: undefined,
        additionalButton: undefined
    }
};

class BackDisplay extends PageBase {
    state = {
        anim: new Animated.Value(0)
    };

    /** @param {BackDisplayProps} props */
    constructor(props) {
        super(props);

        const { iconWidth, zapPose, zapOrientation, action, action2, quote } = {
            ...BackDisplayProps.args,
            ...props.args
        };
        this.quote = null;
        this.iconWidth = iconWidth;
        this.zapPose = zapPose;
        this.zapOrientation = zapOrientation;
        this.callback = () => {
            if (action) {
                action();
            } else {
                user.interface.BackHandle();
            }
        };
        this.callback2 = () => {
            if (action2) {
                action2();
            } else {
                user.interface.BackHandle();
            }
        };

        const quoteItem = quote;
        const anonymousAuthors = langManager.curr['quote']['anonymous-author-list'];
        if (quoteItem) {
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
