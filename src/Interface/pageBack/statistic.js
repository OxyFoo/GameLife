import * as React from 'react';

import user from '../../Managers/UserManager';

class BackStatistic extends React.Component {
    constructor(props) {
        super(props);
        this.stat = this.props.args['stat'] || 'sag';
        this.statXP = user.experience.getStatExperience(this.stat);
    }

    back = () => { user.backPage(); }
    next = () => { user.changePage('statistic', {'stat': this.getSideStat(1)}, true, true); };
    prev = () => { user.changePage('statistic', {'stat': this.getSideStat(-1)}, true, true); };

    getSideStat = (value) => {
        const allStats = [ 'sag', 'int', 'con', 'for', 'end', 'agi', 'dex' ];
        const currStat = this.stat;
        let index = allStats.indexOf(currStat) + value;
        if (index >= allStats.length) index = 0;
        if (index < 0) index = allStats.length - 1;
        return allStats[index];
    }
}

export default BackStatistic;