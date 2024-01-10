import { PageBase } from 'Interface/Components';

import StartTutorial from './tuto';

class BackNewPage extends PageBase {
    componentDidMount() {
        super.componentDidMount();
    }

    componentDidFocused = (args) => {
        StartTutorial.call(this, args?.tuto);
    }
}

export default BackNewPage;
