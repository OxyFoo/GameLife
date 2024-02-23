import { PageBase } from 'Interface/Components';

// -------------------------------------------------
// En dessous de ça c'est des mockup data et des trucs à adapter dans le texte 

const mockupData = [
    {
        accountID: 1,
        username: 'Test1',
        activities: { firstTime: 0, length: 20, totalDuration: 100 },
        xp: 10,
        stats: {
            intelligence: 42,
            force: 58,
            dexterity: 73,
            stamina: 87,
            agility: 66,
            social: 35
        }
    },
    {
        accountID: 2,
        username: 'Moi',
        activities: { firstTime: 0, length: 10, totalDuration: 500 },
        xp: 100,
        stats: {
            intelligence: 77,
            force: 82,
            dexterity: 49,
            stamina: 56,
            agility: 91,
            social: 67
        }
    },
    {
        accountID: 3,
        username: 'Test3',
        activities: { firstTime: 0, length: 50, totalDuration: 1000 },
        xp: 1000,
        stats: {
            intelligence: 88,
            force: 64,
            dexterity: 53,
            stamina: 75,
            agility: 46,
            social: 52
        }
    }
];

const sortListText = ['XP', 'Skills', 'Int', 'For', 'Dex', 'Sta', 'Agi', 'Soc'];

// -------------------------------------------------

class BackClassement extends PageBase {
    sortList = sortListText;

    state = {
        playerData: mockupData.find(player => player.accountID === 2),
        allPlayersData: mockupData,

        /* Filters */
        search: '',
        sortSelectedIndex: 0,
    }

    componentDidMount() {
        super.componentDidMount();
        this.refreshRanking();
    }

    onChangeSearch = (search) => {
        this.setState({ search: search }, this.refreshRanking);
    }
    onSwitchSort = () => {
        const newIndex = (this.state.sortSelectedIndex + 1) % this.sortList.length;
        this.setState({ sortSelectedIndex: newIndex }, this.refreshRanking);
    }


    refreshRanking = () => {
        const { search } = this.state;
        let newRanking = [...mockupData];

        // compute a ranking in number of activities or xp or whatever
        const sort = this.state.sortSelectedIndex;
        if (sort === 0) {
            newRanking.sort((a, b) => b.xp - a.xp);
        } else if (sort === 1) {
            newRanking.sort((a, b) => b.activities.length - a.activities.length);
        } else if (sort === 2) {
            newRanking.sort((a, b) => b.stats.intelligence - a.stats.intelligence);
        } else if (sort === 3) {
            newRanking.sort((a, b) => b.stats.force - a.stats.force);
        } else if (sort === 4) {
            newRanking.sort((a, b) => b.stats.dexterity - a.stats.dexterity);
        } else if (sort === 5) {
            newRanking.sort((a, b) => b.stats.stamina - a.stats.stamina);
        } else if (sort === 6) {
            newRanking.sort((a, b) => b.stats.agility - a.stats.agility);
        } else if (sort === 7) {
            newRanking.sort((a, b) => b.stats.social - a.stats.social);
        } else {
            console.error("sort index unknown: ", sort);
            console.log("sort index unknown: ", sort);
        }

        // Add the rank to the players so the filtering of string doesn't mess up the ranking
        newRanking = newRanking.map((player, index) => ({
            ...player,
            rank: index + 1 // Rank is index + 1 because array indices start at 0
        }));

        // compute the ranking of the me player 
        const meId = 2; // TO REMOVE, only here for the tests !!!! 
        const thisPlayer = newRanking.find(player => player.accountID === meId);

        // Search filter
        if (search !== '') {
            newRanking = newRanking.filter(user => {
                return user.username.toLowerCase().includes(search.toLowerCase());
            });
        }

        // then update the state with the new ranking
        this.setState({ allPlayersData: newRanking, playerData: thisPlayer });
    }
}

export default BackClassement;
