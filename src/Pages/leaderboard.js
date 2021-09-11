import * as React from 'react';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';

class Leaderboard extends React.Component {
    state = {
        self: 0,
        leaderboard: []
    }
    constructor(props) {
        super(props);
        this.loadLoaderboard();
    }
    async loadLoaderboard() {
        const leaderboard = await user.conn.getLeaderboard();
        this.setState({
            self: leaderboard['self'],
            leaderboard: leaderboard['leaderboard']
        });
    }
    componentDidMount() {
        if (!user.conn.online) {
            const title = langManager.curr['leaderboard']['alert-onlineneed-title'];
            const text = langManager.curr['leaderboard']['alert-onlineneed-text'];
            user.openPopup('ok', [ title, text ]);
            setTimeout(user.backPage, 500);
        }
    }

    info = () => {
        const title = langManager.curr['leaderboard']['alert-connectneed-title'];
        const text = langManager.curr['leaderboard']['alert-connectneed-text'];
        user.openPopup('ok', [ title, text ]);
    }
}

export default Leaderboard;