import PageBase from 'Interface/FlowEngine/PageBase';
import user from 'Managers/UserManager';

const test = {
    args: {
        abc: 'def'
    }
}

class BackTest2 extends PageBase {
    feKeepMounted = false;

    state = {
        input: ''
    }

    back = () => {
        user.interface.ChangePage('test');
    }
}

BackTest2.defaultProps = test;
BackTest2.prototype.props = test;

export default BackTest2;
