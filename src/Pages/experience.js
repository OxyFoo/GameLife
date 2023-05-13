import * as React from 'react';

import user from '../Managers/UserManager';

class Experience extends React.Component {
    back = () => { user.backPage(); }
}

export default Experience;