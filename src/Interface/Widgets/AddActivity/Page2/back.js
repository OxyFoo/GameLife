import React from 'react';

import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

import { DEFAULT_ACTIVITY } from 'Data/User/Activities/index';

/**
 * @typedef {import('react-native').View} View
 * @typedef {import('Types/Data/User/Activities').Activity} Activity
 *
 * @typedef {Object} BackActivityPage2PropsType
 * @property {React.RefObject<View>} nativeRef
 * @property {boolean} show
 * @property {Activity} activity
 * @property {Activity | null} editActivity
 * @property {(newActivity: Activity) => Promise<void>} changeActivity
 * @property {() => void} unSelectActivity
 */

/** @type {BackActivityPage2PropsType} */
const BackActivityPage2Props = {
    nativeRef: React.createRef(),
    show: false,
    activity: DEFAULT_ACTIVITY,
    changeActivity: async () => {},
    unSelectActivity: () => {},
    editActivity: null
};

class BackActivityPage2 extends React.Component {
    state = {
        /** @type {string} */
        activityText: '',

        /** @type {string | null} */
        xmlIcon: null,

        categoryColor: 'main1'
    };

    /** @type {React.RefObject<View>} */
    nativeRefAddView = React.createRef();

    /** @type {React.RefObject<View>} */
    nativeRefStartNowView = React.createRef();

    /** @param {BackActivityPage2PropsType} props */
    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            ...this.update()
        };
    }

    update = (updateState = false) => {
        if (this.props.activity.skillID === 0) {
            return;
        }

        const skill = dataManager.skills.GetByID(this.props.activity.skillID);
        if (skill === null) {
            this.props.unSelectActivity();
            return;
        }

        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        if (category === null) {
            this.props.unSelectActivity();
            return;
        }

        const skillName = langManager.GetText(skill.Name);
        const categoryName = langManager.GetText(category.Name);

        const newState = {
            activityText: `${categoryName} - ${skillName}`,
            xmlIcon: dataManager.skills.GetXmlByLogoID(skill.LogoID || category.LogoID),
            categoryColor: category.Color
        };

        if (updateState) {
            this.setState(newState);
        }

        return newState;
    };

    openSkill = () => {
        const { activity } = this.props;
        user.interface.ChangePage('skill', { args: { skillID: activity.skillID } });
    };
}

BackActivityPage2.defaultProps = BackActivityPage2Props;
BackActivityPage2.prototype.props = BackActivityPage2Props;

export default BackActivityPage2;
