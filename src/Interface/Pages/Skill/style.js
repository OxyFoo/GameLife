import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    skillContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24
    },
    pictureContainer: {
        marginLeft: 6,
        marginRight: 24,
        padding: 16,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        borderRadius: 12
    },

    detailContainer: {
        flex: 1,
        paddingVertical: 12,
        justifyContent: 'space-evenly'
    },
    skillTitle: {
        fontSize: 28,
        textAlign: 'left'
    },
    skillCategory: {
        fontSize: 20,
        textAlign: 'left'
    },

    levelContainer: {
        paddingHorizontal: 12,
        marginBottom: 24
    },
    levelText: {
        marginBottom: 6,
        textAlign: 'left'
    },
    creator: {
        marginTop: 12,
        fontSize: 18,
        textAlign: 'left'
    },

    statsContainer: {
        marginBottom: 24
    },

    textHistory: {
        padding: 12
    },

    addActivity: {
        position: 'absolute',
        left: 36,
        right: 36,
        bottom: 36
    }
});

export default styles;