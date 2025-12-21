import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

/**
 * @typedef {import('@oxyfoo/gamelife-types').LeaderboardPlayer} LeaderboardPlayer
 */

class BackLeaderboard extends PageBase {
    static feShowUserHeader = false;
    static feShowNavBar = false;

    state = {
        /** @type {'loading' | 'loaded' | 'error-connection' | 'error-server'} */
        loadingState: 'loading',

        /** @type {string} */
        search: '',

        /** @type {LeaderboardPlayer[]} */
        players: [],

        /** @type {LeaderboardPlayer | null} */
        selfPlayer: null,

        /** @type {number} */
        weekStart: 0
    };

    /** @type {Symbol | null} */
    listenerTcpState = null;

    componentDidMount() {
        this.listenerTcpState = user.server2.tcp.state.AddListener(this.onTcpStateChange);
        this.fetchLeaderboard();
    }

    componentWillUnmount() {
        user.server2.tcp.state.RemoveListener(this.listenerTcpState);
    }

    onTcpStateChange = () => {
        const tcpState = user.server2.tcp.state.Get();
        if (tcpState !== 'connected') {
            this.Back();
        }
    };

    fetchLeaderboard = async () => {
        this.setState({ loadingState: 'loading' });

        const response = await user.server2.tcp.SendAndWait({
            action: 'get-leaderboard'
        });

        // Erreur de connexion
        if (response === 'interrupted' || response === 'not-sent' || response === 'timeout') {
            this.setState({ loadingState: 'error-connection' });
            return;
        }

        // Erreur serveur
        if (response.status !== 'get-leaderboard' || response.result === 'error') {
            this.setState({ loadingState: 'error-server' });
            return;
        }

        this.setState({
            loadingState: 'loaded',
            players: response.result.players,
            selfPlayer: response.result.self,
            weekStart: response.result.weekStart
        });
    };

    /** @param {string} search */
    onChangeSearch = (search) => {
        this.setState({ search });
    };

    getFilteredPlayers = () => {
        const { search, players } = this.state;

        if (search === '') {
            return players;
        }

        const searchLower = search.toLowerCase();
        return players.filter((player) => player.username.toLowerCase().includes(searchLower));
    };

    Back = () => {
        user.interface.BackHandle();
    };
}

export default BackLeaderboard;
