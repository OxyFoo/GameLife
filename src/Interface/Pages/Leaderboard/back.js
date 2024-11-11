import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

/**
 * @typedef {import('Class/Multiplayer').Friend} Friend
 * @typedef {Friend & { label: string, rank: number }} RankedFriend
 */

class BackLeaderboard extends PageBase {
    sortList = {
        XP: langManager.curr['level']['level-small'],
        skills: langManager.curr['leaderboard']['label-activities-small'],
        ...user.statsKey.reduce((acc, key) => {
            acc[key] = langManager.curr['statistics']['names-min'][key];
            return acc;
        }, {})
    };

    /** @type {Array<RankedFriend>} */
    globalPlayersData = [];

    state = {
        /** @type {RankedFriend | null} */
        selfData: null,

        /** @type {Array<RankedFriend>} */
        playersData: [],
        search: '',
        sortIndex: 0
    };

    constructor(props) {
        super(props);

        const activities = user.activities.Get();
        const experience = user.experience.GetExperience();

        /** @type {RankedFriend} */
        const playerData = {
            rank: 0,
            label: '',

            accountID: 0,
            username: user.informations.username.Get(),
            title: user.informations.title.Get(),
            xp: experience.xpInfo.totalXP,

            avatar: {
                Sexe: user.inventory.avatar.sexe,
                Skin: user.inventory.avatar.skin,
                SkinColor: user.inventory.avatar.skinColor,
                Hair: user.inventory.GetStuffByID(user.inventory.avatar.hair).ItemID,
                Top: user.inventory.GetStuffByID(user.inventory.avatar.top).ItemID,
                Bottom: user.inventory.GetStuffByID(user.inventory.avatar.bottom).ItemID,
                Shoes: user.inventory.GetStuffByID(user.inventory.avatar.shoes).ItemID
            },

            activities: {
                firstTime: activities.length ? activities[0].startTime : 0,
                length: activities.length,
                totalDuration: activities.reduce((acc, activity) => acc + activity.duration, 0)
            },

            stats: Object.assign({}, ...user.statsKey.map((i) => ({ [i]: experience.stats[i].totalXP }))),

            // Unused
            currentActivity: null,
            friendshipState: null,
            status: null
        };

        const friendsData = user.multiplayer.friends
            .Get()
            .filter((friend) => friend.friendshipState === 'accepted')
            .map((friend, index) => {
                return {
                    ...friend,
                    label: '',
                    rank: 0
                };
            });

        this.globalPlayersData.push(playerData);
        this.globalPlayersData.push(...friendsData);

        this.state.selfData = playerData;
        this.state.playersData = this.refreshRanking(false).playersData;
    }

    componentDidMount() {
        this.listenerTCP = user.server2.tcp.state.AddListener(this.Back);
    }

    componentWillUnmount() {
        user.server2.tcp.state.RemoveListener(this.listenerTCP);
    }

    onChangeSearch = (search) => {
        this.setState({ search: search }, this.refreshRanking);
    };
    onSwitchSort = () => {
        const sortLength = Object.keys(this.sortList).length;
        const newIndex = (this.state.sortIndex + 1) % sortLength;
        this.setState({ sortIndex: newIndex }, this.refreshRanking);
    };

    refreshRanking = (applyState = true) => {
        const lang = langManager.curr['leaderboard'];
        const langLvl = langManager.curr['level'];
        const langStats = langManager.curr['statistics'];
        const { search, sortIndex } = this.state;
        let newRanking = [...this.globalPlayersData];

        // Sort by XP
        if (sortIndex === 0) {
            newRanking.sort((a, b) => b.xp - a.xp);

            // Define label & ranks
            newRanking.forEach((player, index) => {
                const statExp = user.experience.getXPDict(player.xp);
                player.label = `${langLvl['level']} ${statExp.lvl}`;
                player.rank = index + 1;
            });
        }

        // Sort by skills
        else if (sortIndex === 1) {
            newRanking.sort((a, b) => b.activities.length - a.activities.length);

            // Define label & ranks
            newRanking.forEach((player, index) => {
                player.label = `${player.activities.length} ${lang['label-activities']}`;
                player.rank = index + 1;
            });
        } else if (sortIndex >= 2 && sortIndex <= 1 + user.statsKey.length) {
            const statKey = user.statsKey[sortIndex - 2];
            newRanking.sort((a, b) => b.stats[statKey] - a.stats[statKey]);

            // Define label & ranks
            newRanking.forEach((player, index) => {
                const statExp = user.experience.getXPDict(player.stats[statKey], 'stat');
                player.label = `${statExp.lvl} ${langStats['names'][statKey]}`;
                player.rank = index + 1;
            });
        }

        // Error ?
        else {
            user.interface.console.AddLog('error', 'Leaderboard sort index unknown:', sortIndex);
        }

        // Search filter
        if (search !== '') {
            const searchLower = search.toLowerCase();
            newRanking = newRanking.filter((profile) => {
                return profile.username.toLowerCase().includes(searchLower);
            });
        }

        if (applyState) {
            this.setState({ playersData: newRanking });
        }

        return { playersData: newRanking };
    };

    Back = () => {
        user.interface.BackHandle();
    };
}

export default BackLeaderboard;
