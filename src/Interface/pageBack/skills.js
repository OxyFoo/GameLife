import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import dataManager from '../../Managers/DataManager';

class BackSkills extends React.Component {
    SORT_LIST = langManager.curr['skills']['top-sort-list'];
    state = {
        search: '',
        filters: dataManager.skills.getCategories(true),
        selectedFiltersIndex: [],
        sortSelectedIndex: 0,
        ascending: true,
        skills: user.experience.getAllSkills(undefined, undefined, 0, true)
    }

    back = () => { user.interface.backPage(); }
    addSkill = () => {
        if (dataManager.skills.getAll().length <= 1) {
            console.warn("Aucun skill !");
            return;
        }
        user.interface.changePage('activity');
    }
    switchSort = () => {
        const newIndex = (this.state.sortSelectedIndex + 1) % this.SORT_LIST.length;
        this.setState({ sortSelectedIndex: newIndex });
        setTimeout(this.refreshSkills, 50);
    }
    switchOrder = () => {
        this.setState({ ascending: !this.state.ascending });
        setTimeout(this.refreshSkills, 50);
    }
    changeText = (newText) => {
        this.setState({ search: newText });
        setTimeout(this.refreshSkills, 50);
    }
    filterChange = (indexes) => {
        this.setState({ selectedFiltersIndex: indexes });
        setTimeout(this.refreshSkills, 50);
    }

    refreshSkills = () => {
        const search = this.state.search;
        let filters = [];
        for (let i = 0; i < this.state.selectedFiltersIndex.length; i++) {
            filters.push(this.state.filters[this.state.selectedFiltersIndex[i]].value);
        }
        const sort = this.state.sortSelectedIndex;
        const ascending = this.state.ascending;
        const skills = user.experience.getAllSkills(search, filters, sort, ascending);
        this.setState({ skills: skills });
    }
}

export default BackSkills;