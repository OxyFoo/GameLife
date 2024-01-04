import * as React from 'react';

import RenderPopup from './popup';
import user from 'Managers/UserManager';

/**
 * @typedef {import('react-native').ViewStyle} ViewStyle
 * @typedef {import('react-native').StyleProp<ViewStyle>} StyleProp
 */

const NonZeroDayProps = {
    /** @type {StyleProp} */
    style: {}
};

class NonZeroDayBack extends React.Component {
    state = {
        claimIndex: -1,
        claimDay: 0
    }

    timeout;
    nzdListener;

    refContainer = null;
    refMore = null;

    componentDidMount() {
        this.update();
        this.nzdListener = user.quests.nonzerodays.claimsList.AddListener(this.update);
    }

    componentWillUnmount() {
        if (this.timeout) clearTimeout(this.timeout);
        user.quests.nonzerodays.claimsList.RemoveListener(this.nzdListener);
    }

    update = () => {
        let claimDay = 0;
        const claimIndex = user.quests.nonzerodays.GetCurrentClaimIndex();
        const claimList = user.quests.nonzerodays.claimsList.Get()[claimIndex];
        if (claimIndex !== -1) {
            for (claimDay = 0; claimDay <= claimList.daysCount; claimDay++) {
                if (!claimList.claimed.includes(claimDay + 1)) break;
            }
        }

        this.setState({ claimIndex, claimDay });
    }

    openPopup = () => {
        user.interface.popup.Open('custom', () => <RenderPopup />, undefined, true, false);
    }

    /** @param {number} index */
    onClaimPress = (index) => {
        this.timeout = setTimeout(this.update, 500);
    }
}

NonZeroDayBack.prototype.props = NonZeroDayProps;
NonZeroDayBack.defaultProps = NonZeroDayProps;

export default NonZeroDayBack;
