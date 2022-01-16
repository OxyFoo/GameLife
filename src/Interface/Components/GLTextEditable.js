import * as React from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import GLText, { MAIN_FONT_NAME } from './GLText';

class GLTextEditable extends React.Component {
    state = {
        editMode: false
    }

    editMode_Enable = () => {
        const open = () => {
            this.setState({ editMode: true });
        }
        if (typeof(this.props.beforeChangeText) !== 'undefined') {
            this.props.beforeChangeText(open);
        } else {
            open();
        }
    }

    render() {
        return !this.state.editMode ? (
            <TouchableOpacity activeOpacity={.5} onPress={this.editMode_Enable}>
                <GLText style={this.props.style} title={this.props.value || this.props.defaultValue} color='secondary' />
            </TouchableOpacity>
        ) : (
            <TextInput
                style={[this.props.style, styles.input]}
                onChangeText={this.props.onChangeText}
                value={this.props.value}
                placeholder={this.props.placeholder}
                placeholderTextColor='#C2C2C2'
                textContentType={this.props.textContentType}
                autoFocus={true}
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