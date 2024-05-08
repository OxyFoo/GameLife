import PageBase from 'Interface/FlowEngine/PageBase';

const test = {
    args: {
        abc: 'def'
    }
};

class BackTest2 extends PageBase {
    feKeepMounted = false;

    state = {
        input: ''
    };

    back = () => {
        this.fe.BackHandle();
    };

    openApp = () => {
        this.fe.ChangePage('loading', { storeInHistory: false });
    };
}

BackTest2.defaultProps = test;
BackTest2.prototype.props = test;

export default BackTest2;
