import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

const SORT_LIST = langManager.curr['skills']['top-sort-list'];

class BackSkills extends React.Component {
    state = {
        height: '40%', // Start approximately at 40% of the screen height
        selectedCategories: []
    }

    addActivity = () => { user.interface.ChangePage('activity', undefined, true); }

    switchCategory = (ID) => {
        const contains = this.state.selectedCategories.includes(ID);
        if (contains) {
            let newCategories = [...this.state.selectedCategories];
            const index = newCategories.indexOf(ID);
            newCategories.splice(index, 1);
            this.setState({ selectedCategories: newCategories });
        } else {
            this.setState({ selectedCategories: [ ...this.state.selectedCategories, ID ] });
        }
    }

    /*state = {
        search: '',
        filters: dataManager.skills.GetCategories(true),
        selectedFiltersIndex: [],
        sortSelectedIndex: 0,
        ascending: true,
        skills: user.experience.GetAllSkills(undefined, undefined, 0, true)
    }*/

    switchSort = () => {
        const newIndex = (this.state.sortSelectedIndex + 1) % SORT_LIST.length;
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
        const skills = user.experience.GetAllSkills(search, filters, sort, ascending);
        this.setState({ skills: skills });
    }
}

export default BackSkills;