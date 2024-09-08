import React from 'react';

import { DEFAULT_ACTIVITY } from 'Class/Activities';
import { StartActivityNow } from 'Utils/Activities';

/**
 * @typedef {import('Types/Class').Activity} Activity
 *
 * @typedef {Object} BackActivityPage2StartNowPropsType
 * @property {Activity} activity
 */

/** @type {BackActivityPage2StartNowPropsType} */
const BackActivityPage2StartNowProps = {
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
