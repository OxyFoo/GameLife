import React from 'react';

import { DEFAULT_ACTIVITY } from 'Data/User/Activities/index';
import { StartActivityNow } from 'Utils/Activities';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('Types/Data/User/Activities').Activity} Activity
 *
 * @typedef {Object} BackActivityPage2StartNowPropsType
 * @property {React.RefObject<View | null>} nativeRef
 * @property {Activity} activity
 */

/** @type {BackActivityPage2StartNowPropsType} */
const BackActivityPage2StartNowProps = {
    nativeRef: React.createRef(),
    activity: DEFAULT_ACTIVITY
};

class BackActivityPage2StartNow extends React.Component {
    onAddActivityNow = () => {
        const { activity } = this.props;

        if (activity.skillID === 0) {
            return;
        }

        StartActivityNow(activity.skillID);
    };
}

BackActivityPage2StartNow.defaultProps = BackActivityPage2StartNowProps;
BackActivityPage2StartNow.prototype.props = BackActivityPage2StartNowProps;

export default BackActivityPage2StartNow;
