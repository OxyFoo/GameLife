import { PageBack } from 'Interface/Components';
import StartTutorial from './tuto';

class BackShop extends PageBack {
    refTuto1 = null;
    refTuto2 = null;
    refTuto3 = null;
    refTuto4 = null;

    componentDidFocused = (args) => {
        StartTutorial.call(this, args?.tuto);
    }
}

export default BackShop;