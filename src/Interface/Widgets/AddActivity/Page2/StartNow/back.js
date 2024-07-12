import React from 'react';

import { StartActivityNow } from 'Utils/Activities';

/**
 * @typedef {import('Data/Skills').Skill} Skill
 *
 * @typedef {import('Interface/Components').InputText} InputText
 *
 * @typedef {Object} BackActivityPage2StartNowPropsType
 * @prop {number | null} skillID
 */

/** @type {BackActivityPage2StartNowPropsType} */
const BackActivityPage2StartNowProps = {
    skillID: null
};

class BackActivityPage2StartNow extends React.Component {
    onAddActivityNow = () => {
        const { skillID } = this.props;

        if (!skillID) {
            return;
        }

        StartActivityNow(skillID);
    };
}

BackActivityPage2StartNow.defaultProps = BackActivityPage2StartNowProps;
BackActivityPage2StartNow.prototype.props = BackActivityPage2StartNowProps;

export default BackActivityPage2StartNow;
