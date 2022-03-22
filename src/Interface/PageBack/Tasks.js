import * as React from 'react';

import user from '../../Managers/UserManager';

class BackTasks extends React.Component {
    state = {
        adLoaded: false
    }

    constructor(props) {
        super(props);
        this.tasks = user.tasks.Get();
        this.rewardedShop = user.admob.GetRewardedAd('todo', 'add10Ox', this.adStateChange);
        this.state.adLoaded = this.rewardedShop.loaded;
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

    adStateChange = (loaded) => {
        if (typeof(loaded) === 'boolean') {
            this.setState({ adLoaded: loaded });
        } else {
            this.forceUpdate();
        }
    }
}

export default BackTasks;