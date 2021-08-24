import * as React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import GLIconButton from './GLIconButton';
import { isUndefined } from '../../Functions/Functions';

function GLSearchBar(props) {
    const [ getInput, setInput ] = React.useState('');

    const onChange = (newText) => { setInput(newText); }
    const onValid = () => {
        const search  = getInput.trim();
        if (search && !isUndefined(props.onSearch)) {
            props.onSearch(search);
        }
    }

    return (
        <View style={[styles.container, props.style]}>
            <TextInput
                style={styles.input}
                placeholder={props.placeholder}
                placeholderTextColor={"#CCCCCC"}
                onChangeText={onChange}
            />
            <GLIconButton icon='pencil' onPress={onValid} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    input: {
        flex: 1,
        height: '100%',
        padding: 6,
        color: '#FFFFFF'
    }
});

export default GLSearchBar;