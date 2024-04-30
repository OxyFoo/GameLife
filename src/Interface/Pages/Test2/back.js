import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

class BackTest2 extends PageBase {
    feKeepMounted = false;

    state = {
        input: ''
    }

    back = () => {
        user.interface.ChangePage('test');
    }
}

export default BackTest2;
