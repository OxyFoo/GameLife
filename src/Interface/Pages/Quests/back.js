import StartTutorial from './tuto';

import { PageBase } from 'Interface/Components';

class BackNewPage extends PageBase {
    componentDidMount() {
        super.componentDidMount();
    }

    componentDidFocused = (args) => {
        StartTutorial.call(this, args?.tuto);
    }
}

export default BackNewPage;
