import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 24
    },

    titleContainer: {
        marginBottom: 24,
        fontSize: 36
    },
    container: {
        marginTop: 24
    },

    text: {
        fontSize: 22
    },
    textSuggest: {
        marginBottom: 24,
        fontSize: 22
    },
    input: {
        marginBottom: 24
    },

    marginBot: {
        marginBottom: 24
    },

    column: {
        width: '50%'
    },
    row: {
        marginVertical: 24,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    rowDigit: {
        marginVertical: 2,
        paddingHorizontal: '20%',

        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});

export default styles;
