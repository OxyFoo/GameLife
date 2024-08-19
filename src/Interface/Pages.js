/* eslint-disable prettier/prettier */
const PAGES = {
    about:                  require('./Pages/About').default,
    achievements:           require('./Pages/Achievements').default,
    activitytimer:          require('./Pages/ActivityTimer').default,
    benchmark:              require('./Pages/Debug_BenchMark').default,
    responsive:             require('./Pages/Debug_Responsive').default,
    calendar:               require('./Pages/Calendar').default,
    chestreward:            require('./Pages/ChestReward').default,
    display:                require('./Pages/Display').default,
    home:                   require('./Pages/Home').default,
    leaderboard:            require('./Pages/Leaderboard').default,
    loading:                require('./Pages/Loading').default,
    login:                  require('./Pages/Login').default,
    multiplayer:            require('./Pages/Multiplayer').default,
    myquest:                require('./Pages/MyQuest').default,
    myqueststats:           require('./Pages/MyQuestStats').default,
    onboarding:             require('./Pages/Onboarding').default,
    profile:                require('./Pages/Profile').default,
    profilefriend:          require('./Pages/ProfileFriend').default,
    myquests:               require('./Pages/MyQuests').default,
    report:                 require('./Pages/Report').default,
    settings:               require('./Pages/Settings').default,
    settings_consents:      require('./Pages/Settings/Consents').default,
    settings_notifications: require('./Pages/Settings/Notifications').default,
    shop:                   require('./Pages/Shop').default,
    skill:                  require('./Pages/Skill').default,
    skills:                 require('./Pages/Skills').default,
    statistics:             require('./Pages/Statistics').default,
    waitinternet:           require('./Pages/WaitInternet').default,
    waitmail:               require('./Pages/WaitMail').default,
    test:                   require('./Pages/Test').default,
    test2:                  require('./Pages/Test2').default,
    todo:                   require('./Pages/Todo').default
};
/* eslint-enable prettier/prettier */

/**
 * @typedef {keyof typeof PAGES} PageNames
 */

export default PAGES;
