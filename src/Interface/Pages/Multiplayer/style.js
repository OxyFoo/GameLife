import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        padding: 24,
        paddingBottom: 0
    },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12
    },

    title: {
        flex: 1,
        textAlign: 'left',
        fontSize: 21,
        textTransform: 'uppercase'
    },

    titleButton: {
        width: 'auto',
        paddingVertical: 4,
        paddingHorizontal: 4
    },

    topContainer: {
        marginTop: 12,
        marginBottom: 12
    }
});

export default styles;
