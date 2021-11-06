import * as React from 'react';

import user from '../../Managers/UserManager';

class BackExperience extends React.Component {
    back = () => { user.backPage(); }
}

export default BackExperience;