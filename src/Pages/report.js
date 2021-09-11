import * as React from 'react';

import user from '../Managers/UserManager';

class Report extends React.Component {
    back = () => { user.backPage(); }
    test = () => { console.log("YESSS"); }
}

export default Report;