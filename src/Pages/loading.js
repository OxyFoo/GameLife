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
        if (this.props.args['state'] && this.state.quote === '' && user.quotes.length > 0) {
            const random = Math.random() * user.quotes.length;
            const index = parseInt(random - 1);
            const quote = user.quotes[index];
            this.setState({ quote: quote['Quote'], author: quote['Author'] });
        }
    }

    loop = () => {
        this.setState({ textPoints: this.state.textPoints + 0.5 });
    }

    render() {
        const index = parseInt(this.state.textPoints) % POINTS.length;
        const loading_points = POINTS[index];
        const loading_title = langManager.curr['loading']['text-title'];
        return (
            <View style={styles.content}>
                    <GLLoading state={this.props.args['state']} />
                    <GLText style={styles.title} title={loading_title + loading_points} />
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
    title: {
        marginTop: 6,
        marginLeft: 24,
        width: 200,
        textAlign: 'left',
        color: '#3E99E7',
        fontSize: 28
    },
    citation: {
        width: '80%',
        marginTop: 16,
        marginBottom: 12,
        textAlign: 'justify'
    },
    author: {
        width: '80%',
        marginVertical: 12,
        textAlign: 'right'
    }
});

export default Loading;