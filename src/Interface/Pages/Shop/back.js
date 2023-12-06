import { PageBase } from 'Interface/Components';
import StartTutorial from './tuto';

/**
 * @typedef {import('Interface/Components').Page} Page
 * @typedef {import('./UI/header').default} ShopHeader
 */

class BackShop extends PageBase {
    state = {
        /** @type {Page | null} */
        refPage: null
    }

    /** @type {ShopHeader} */
    refTuto1 = null;
    refTuto2 = null;
    refTuto3 = null;
    refTuto4 = null;
    refTuto5 = null;

    componentDidFocused = (args) => {
        StartTutorial.call(this, args?.tuto);
    }

    setRef = (ref) => {
        this.refPage = ref;
        this.setState({ refPage: ref });
    }
}

export default BackShop;
