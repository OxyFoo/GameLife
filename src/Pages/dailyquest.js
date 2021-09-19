import * as React from 'react';
import { GetTimeToTomorrow } from '../Functions/Functions';

class Dailyquest extends React.Component {
    state = {
        time: GetTimeToTomorrow()
    }

    componentDidMount() {
        this.interval = setInterval(this.loop, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    loop = () => {
        this.setState({ time: GetTimeToTomorrow() });
    }
}

export default Dailyquest;