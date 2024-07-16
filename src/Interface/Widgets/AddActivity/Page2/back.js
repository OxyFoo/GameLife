import React from 'react';

import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { Activity } from 'Class/Activities';

/**
 * @typedef {Object} BackActivityPage2PropsType
 * @prop {Activity} activity
 * @prop {Activity | null} editActivity
 * @prop {(newActivity: Activity) => Promise<void>} changeActivity
 * @prop {() => void} unSelectActivity
 */

/** @type {BackActivityPage2PropsType} */
const BackActivityPage2Props = {
    activity: new Activity(),
    changeActivity: async () => {},
    unSelectActivity: () => {},
    editActivity: null
};

class BackActivityPage2 extends React.Component {
    state = {};

    /** @type {string} */
    activityText = '';

    /** @type {string | null} */
    xmlIcon = null;

    /** @param {BackActivityPage2PropsType} props */
    constructor(props) {
        super(props);

        const skill = dataManager.skills.GetByID(props.activity.skillID);
        if (skill === null) {
            props.unSelectActivity();
            return;
        }

        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        if (category === null) {
            props.unSelectActivity();
            return;
        }

        const skillName = langManager.GetText(skill.Name);
        const categoryName = langManager.GetText(category.Name);
        this.activityText = `${categoryName} - ${skillName}`;
        this.xmlIcon = dataManager.skills.GetXmlByLogoID(skill.LogoID);
    }
}

BackActivityPage2.defaultProps = BackActivityPage2Props;
BackActivityPage2.prototype.props = BackActivityPage2Props;

export default BackActivityPage2;
