import React from 'react';

import { StartActivityNow } from 'Utils/Activities';

import { Activity } from 'Class/Activities';

/**
 * @typedef {Object} BackActivityPage2StartNowPropsType
 * @prop {Activity} activity
 */

/** @type {BackActivityPage2StartNowPropsType} */
const BackActivityPage2StartNowProps = {
    activity: new Activity()
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
