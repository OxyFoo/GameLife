import { Animated } from 'react-native';

import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').NativeSyntheticEvent<import('react-native').NativeScrollEvent>} ScrollEvent
 * @typedef {import('@oxyfoo/gamelife-types/Data/User/Raids').RaidHistoryEntry} RaidHistoryEntry
 * @typedef {'loading' | 'loaded' | 'error-connection' | 'error-server'} LoadingState
 */

const BackRaidDetailsProps = {
    args: {
        /** @type {number} 0 this raid, 1 past raids */
        tab: 0
    }
};

class BackRaidDetails extends PageBase {
    // The boss portrait is the page background and must run under the status bar: the page owns the
    // whole height and pads its own content by the safe-area inset (see render).
    static feHeaderOverlay = true;

    /** Scroll position of the page, driving the parallax of the boss portrait */
    scrollY = new Animated.Value(0);

    /** @param {ScrollEvent} event */
    handleScroll = (event) => {
        this.scrollY.setValue(event.nativeEvent.contentOffset.y);
    };

    state = {
        /** @type {number} */
        tab: 0,

        /** @type {LoadingState} */
        historyState: 'loading',

        /** @type {RaidHistoryEntry[]} */
        history: []
    };

    componentDidMount() {
        this.componentDidFocused(this.props);
    }

    /** @param {this['props']} props */
    componentDidFocused(props) {
        this.setTab(props.args.tab ?? 0);
    }

    /** @param {number} index */
    setTab = (index) => {
        this.setState({ tab: index }, () => {
            if (index === 1) {
                this.fetchHistory();
            }
        });
    };

    fetchHistory = async () => {
        this.setState({ historyState: 'loading' });
        const result = await user.raids.LoadHistory();
        if (typeof result === 'string') {
            this.setState({ historyState: result });
            return;
        }
        this.setState({ historyState: 'loaded', history: result.seasons });
    };

    onBack = () => {
        user.interface.BackHandle();
    };
}

BackRaidDetails.defaultProps = BackRaidDetailsProps;
BackRaidDetails.prototype.props = BackRaidDetailsProps;

export default BackRaidDetails;
