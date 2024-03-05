import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    flatlist: {
        position: 'absolute',
        left: 12,
        right: 12,
        bottom: 12
    },

    achievementsContainer: {
        width: '50%',
        padding: 6
    },
    achievementsBox: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-between',
        padding: 6,
        borderWidth: 2,
        borderRadius: 8
    },
    title: {
        minHeight: 30,
        marginBottom: 12,
        fontSize: 18
    },
    description: {
        marginBottom: 12,
        fontSize: 14
    },

    progressBar: {
        height: 4,
        borderRadius: 6,
        backgroundColor: 'rgba(0,0,0,.2)'
    },
    progressBarInner: {
        height: '100%',
        borderRadius: 6
    },
    progressionValue: {
        position: 'absolute',
        right: 6,
        bottom: 0
    },
    progressBarIcon: {
        position: 'absolute',
        bottom: 6,
        left: 6
    }
});

export default styles;
