import { PageBase } from 'Interface/Components';

import user from 'Managers/UserManager';

class BackNewPage extends PageBase {
    state = {
        server: ''
    }

    componentDidMount() {
        super.componentDidMount();
    }
}

export default BackNewPage;
