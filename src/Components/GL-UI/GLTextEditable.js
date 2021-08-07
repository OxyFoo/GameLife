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
        if (typeof(this.props.beforeEdit) !== 'undefined') {
            this.props.beforeEdit();
        }
        this.setState({ editMode: true });
    }

    render() {
        return !this.state.editMode ? (
            <TouchableOpacity activeOpacity={.5} onPress={this.editMode_Enable}>
                <GLText style={this.props.style} title={this.props.title} />
            </TouchableOpacity>
        ) : (
            <TextInput
                style={styles.input}
                onChangeText={this.props.onEdit}
                value={this.props.title}
                placeholder="Pseudo"
            />
        )
    }
}

const styles = StyleSheet.create({
    input: {
        color: '#5AB4F0',
        fontFamily: MAIN_FONT_NAME,
        fontSize: 20,
        paddingVertical: 3,
        paddingHorizontal: 12,
        borderBottomColor: '#5AB4F0',
        borderBottomWidth: 2,
        marginBottom: 18
    }
});

export default GLTextEditable;