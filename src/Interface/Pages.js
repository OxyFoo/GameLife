// The columns below are aligned by hand; this file is listed in .prettierignore.
const PAGES = {
    about:                  require('./Pages/About').default,
    achievements:           require('./Pages/Achievements').default,
    activitytimer:          require('./Pages/ActivityTimer').default,
    benchmark:              require('./Pages/Debug_BenchMark').default,
    responsive:             require('./Pages/Debug_Responsive').default,
    calendar:               require('./Pages/Calendar').default,
    chestreward:            require('./Pages/ChestReward').default,
    display:                require('./Pages/Display').default,
    itemreward:             require('./Pages/ItemReward').default,
    friends:                require('./Pages/Friends').default,
    home:                   require('./Pages/Home').default,
    loading:                require('./Pages/Loading').default,
    login:                  require('./Pages/Login').default,
    multiplayer:            require('./Pages/Multiplayer').default,
    onboarding:             require('./Pages/Onboarding').default,
    profile:                require('./Pages/Profile').default,
    report:                 require('./Pages/Report').default,
    settings:               require('./Pages/Settings').default,
    settings_beta:          require('./Pages/Settings/Beta').default,
    settings_privacy:       require('./Pages/Settings/Privacy').default,
    settings_notifications: require('./Pages/Settings/Notifications').default,
    shop:                   require('./Pages/Shop').default,
    skill:                  require('./Pages/Skill').default,
    skills:                 require('./Pages/Skills').default,
    statistics:             require('./Pages/Statistics').default,
    waitinternet:           require('./Pages/WaitInternet').default,
    waitmail:               require('./Pages/WaitMail').default,
    test:                   require('./Pages/Test').default,
    todo:                   require('./Pages/Todo').default
};

/**
 * @typedef {keyof typeof PAGES} PageNames
 */

export default PAGES;
