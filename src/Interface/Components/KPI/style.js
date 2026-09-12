import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Centered so the content stays in the middle when the tile is stretched by its row or column
    gradient: {
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        borderRadius: 8
    },
    container: {
        padding: 12,

        alignItems: 'center',
        justifyContent: 'center'
    },
    value: {
        margin: 0,
        fontSize: 21,
        fontWeight: 'bold'
    },
    title: {
        margin: 0,
        fontSize: 14
    }
});

export default styles;
