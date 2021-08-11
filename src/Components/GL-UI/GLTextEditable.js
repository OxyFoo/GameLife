import * as React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import GLText, { MAIN_FONT_NAME } from './GLText';

class GLTextEditable extends React.Component {
    state = {
        editMode: false
    }

    componentDidMount() {
    }

    editMode_Enable = () => {
        if (typeof(this.props.beforeChangeText) !== 'undefined') {
            this.props.beforeChangeText();
        }
        this.setState({ editMode: true });
    }

    render() {
        return !this.state.editMode ? (
            <TouchableOpacity activeOpacity={.5} onPress={this.editMode_Enable}>
                <GLText style={this.props.style} title={this.props.value} color='grey' />
            </TouchableOpacity>
        ) : (
            <TextInput
                style={[this.props.style, styles.input]}
                onChangeText={this.props.onChangeText}
                value={this.props.value}
                placeholder="Pseudo"
                textContentType={this.props.textContentType}
            />
        )
    }
}

const styles = StyleSheet.create({
    input: {
        margin: 0,
        padding: 0,
        color: '#FFFFFF',
        fontFamily: MAIN_FONT_NAME,
        fontSize: 20,
    }
});

export default GLTextEditable;