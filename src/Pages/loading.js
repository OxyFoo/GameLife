import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { GLText, GLLoading } from '../Components/GL-Components';

const POINTS = [ '', '.', '..', '...', '..', '.' ];

class Loading extends React.Component {
    state = {
        textPoints: 0,
        quote: '',
        author: ''
    }

    componentDidMount() {
        this.interval = setInterval(this.loop, 500);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidUpdate() {
        if (this.state.quote === '' && user.quotes.length > 0) {
            const random = user.random(0, user.quotes.length - 1);
            const quote = user.quotes[random];
            this.setState({ quote: quote['Quote'], author: quote['Author'] });
        }
    }

    loop = () => {
        this.setState({ textPoints: this.state.textPoints + 0.5 });
    }

    render() {
        const state = typeof(this.props.args['state']) === 'number' ? this.props.args['state'] : 0;
        const index = parseInt(this.state.textPoints) % POINTS.length;
        const loading_title = langManager.curr['loading']['text-title'];
        const loading_points = POINTS[index];
        return (
            <View style={styles.content}>
                    <GLLoading state={state} />
                    <View style={styles.containTitle}>
                        {index !== 0 && (<GLText style={styles.points} title={loading_points} color={'transparent'} />)}
                        <GLText style={styles.title} title={loading_title} />
                        {index !== 0 && (<GLText style={styles.points} title={loading_points} />)}
                    </View>
                    <GLText style={styles.citation} title={this.state.quote} />
                    <GLText style={styles.author} title={this.state.author} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        width: '100%',
        height: '100%',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    containTitle: {
        width: '100%',
        top: -24,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: 28,
        zIndex: 10,
        elevation: 10
    },
    points: {
        fontSize: 28
    },
    citation: {
        top: -24,
        width: '80%',
        marginTop: 16,
        marginBottom: 12,
        textAlign: 'justify'
    },
    author: {
        top: -24,
        width: '80%',
        marginVertical: 12,
        textAlign: 'right'
    }
});

export default Loading;