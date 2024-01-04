import * as React from 'react';

import RenderPopup from './popup';
import user from 'Managers/UserManager';

import { GetDate } from 'Utils/Time';
import { DateToFormatString } from 'Utils/Date';

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
        claimDay: 0,
        claimDate: null
    }

    /** @type {NodeJS.Timeout} */
    timeoutToNextClaim;

    /** @type {Symbol} */
    nzdListener;

    componentDidMount() {
        this.update();
        this.nzdListener = user.quests.nonzerodays.claimsList.AddListener(this.update);
    }

    componentWillUnmount() {
        if (this.timeoutToNextClaim) clearTimeout(this.timeoutToNextClaim);
        user.quests.nonzerodays.claimsList.RemoveListener(this.nzdListener);
    }

    update = () => {
        let claimDay = 0;
        let claimDate = null;

        const claimIndex = user.quests.nonzerodays.GetCurrentClaimIndex();
        const claimsList = user.quests.nonzerodays.claimsList.Get();
        const claimList = claimsList[claimIndex];
        if (claimIndex !== -1) {
            for (claimDay = 0; claimDay <= claimList.daysCount; claimDay++) {
                if (!claimList.claimed.includes(claimDay + 1)) break;
            }
            if (!user.quests.nonzerodays.IsCurrentList(claimList)) {
                claimDate = DateToFormatString(GetDate(claimList.start));
            }
        }

        this.setState({ claimIndex, claimDay, claimDate });
    }

    openPopup = () => {
        user.interface.popup.Open('custom', () => <RenderPopup />, undefined, true, false);
    }

    /** @param {number} index */
    onClaimPress = (index) => {
        this.timeoutToNextClaim = setTimeout(this.update, 500);
    }
}

NonZeroDayBack.prototype.props = NonZeroDayProps;
NonZeroDayBack.defaultProps = NonZeroDayProps;

export default NonZeroDayBack;
