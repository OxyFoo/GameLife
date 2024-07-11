import React from 'react';

import dataManager from 'Managers/DataManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Data/Skills').Skill} Skill
 * @typedef {import('../types').ItemSkill} ItemSkill
 * @typedef {import('../types').EnrichedSkill} EnrichedSkill
 * @typedef {import('../types').ItemCategory} ItemCategory
 *
 * @typedef {import('Interface/Components').InputText} InputText
 *
 * @typedef {Object} BackActivityPage2PropsType
 * @prop {number | null} skillID
 * @prop {(duration: number) => void} onChangeDuration Called when the duration is changed (in minutes)
 * @prop {() => void} unSelectSkill
 */

/** @type {BackActivityPage2PropsType} */
const BackActivityPage2Props = {
    skillID: null,
    onChangeDuration: () => {},
    unSelectSkill: () => {}
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

        if (props.skillID === null) {
            props.unSelectSkill();
            return;
        }

        const skill = dataManager.skills.GetByID(props.skillID);
        if (skill === null) {
            props.unSelectSkill();
            return;
        }

        const category = dataManager.skills.GetCategoryByID(skill.CategoryID);
        if (category === null) {
            props.unSelectSkill();
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
