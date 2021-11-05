import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import Loading from '../back/loading';
import { GLText, GLLoading } from '../Components';

import langManager from '../../Managers/LangManager';

class T0Loading extends Loading {
    render() {
        const state = typeof(this.props.args['state']) === 'number' ? this.props.args['state'] : 0;
        const index = parseInt(this.state.textPoints) % this.POINTS.length;
        const loading_title = langManager.curr['loading'][this.state.loaded ? 'text-loaded' : 'text-loading'];
        const loading_points = this.POINTS[index];
        const loaded_text = langManager.curr['loading']['text-end'];

        return (
            <View style={styles.content} onTouchStart={this.screenPress.bind(this)} pointerEvents="box-only">
                <GLLoading state={state} />
                <View style={styles.containTitle}>
                    {!this.state.loaded && (<GLText style={styles.points} title={loading_points} color={'transparent'} />)}
                    <GLText style={styles.title} title={loading_title} />
                    {!this.state.loaded && (<GLText style={styles.points} title={loading_points} />)}
                </View>
                <GLText style={styles.citation} title={this.state.quote} />
                <GLText style={styles.author} title={this.state.author} />
                {this.state.loaded && <GLText style={styles.text} title={loaded_text} />}
            </View>
        )
    }
}
const ww = Dimensions.get('window').width ; 
const wh = Dimensions.get('window').height ;

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
        top: - (wh * 359 / 10000),
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    title: {
        fontSize: ww * 746 / 10000,
        zIndex: 10,
        elevation: 10, 
    },
    points: {
        fontSize: ww * 746 / 10000
    },
    citation: {
        top: - (wh * 359 / 10000),
        width: '80%',
        marginTop: "5%",
        marginBottom: "3%",
        paddingBottom: "3%",
        textAlign: 'justify'
    },
    author: {
        top: - (wh * 359 / 10000),
        width: '80%',
        marginVertical: "3%",
        textAlign: 'right'
    },
    text: {
        position: 'absolute',
        left: 0,
        bottom: '10%',
        width: '100%'
    }
});

export { T0Loading };