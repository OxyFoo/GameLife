import * as React from 'react';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';

class BackLeaderboard extends React.Component {
    state = {
        self: 0,
        leaderboard: [],
        time: ''
    }
    constructor(props) {
        super(props);
        this.loadLoaderboard();
    }
    async loadLoaderboard(week = false) {
        const response_leaderboard = await user.server.getLeaderboard(week);

        if (response_leaderboard.status === 200) {
            this.setState({
                self: response_leaderboard.data['self'],
                leaderboard: response_leaderboard.data['leaderboard'],
                time: week ? 'week' : ''
            });
        }
    }
    componentDidMount() {
        if (!user.server.online) {
            const title = langManager.curr['leaderboard']['alert-onlineneed-title'];
            const text = langManager.curr['leaderboard']['alert-onlineneed-text'];
            user.openPopup('ok', [ title, text ]);
            setTimeout(user.backPage, 500);
        }
    }

    toggle = () => {
        // TODO
        console.log(this.state.time);
        this.loadLoaderboard(this.state.time == 'week');
    }

    info = () => {
        const title = langManager.curr['leaderboard']['alert-connectneed-title'];
        const text = langManager.curr['leaderboard']['alert-connectneed-text'];
        user.openPopup('ok', [ title, text ]);
    }
}

export default BackLeaderboard;