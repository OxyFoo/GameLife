import * as React from 'react';

import user from '../../Managers/UserManager';

/**
 * @typedef {import('../../Class/Admob').AdStates} AdStates
 * @typedef {import('../../Class/Admob').AdTypes['add10Ox']} AdEvent
 */

class BackTasks extends React.Component {
    state = {
        /** @type {AdStates} */
        adState: 'wait',
    }

    constructor(props) {
        super(props);
        this.tasks = user.tasks.Get();
        this.rewardedShop = user.admob.GetRewardedAd('todo', 'add10Ox', this.adStateChange);
        this.state.adLoaded = this.rewardedShop !== null ? this.rewardedShop.loaded : null;
    }
    componentWillUnmount() {
        user.admob.ClearEvents('todo');
    }

    addTask = () => {
        user.interface.ChangePage('task', undefined, true);
    }
    onTaskCheck = () => {
        // TODO
    }

    watchAd = () => {
        if (this.rewardedShop === null) {
            user.interface.console.AddLog('warn', 'Ad not created');
            return;
        }
        if (!this.rewardedShop.loaded) {
            user.interface.console.AddLog('warn', 'Ad not loaded');
            return;
        }

        this.rewardedShop.show();
    }

    /** @type {AdEvent} */
    adStateChange = (state) => this.setState({ adState: state });
}

export default BackTasks;