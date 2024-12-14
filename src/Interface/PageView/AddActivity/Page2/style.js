import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        height: '100%',
        paddingTop: 24,
        paddingHorizontal: 24
    },

    headerButton: {
        marginTop: 24,
        paddingHorizontal: 18
    },
    headerButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerButtonActivity: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerButtonText: {
        fontSize: 16,
        marginLeft: 12
    },
    headerStats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 12,
        marginBottom: 6
    },

    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    separatorBar: {
        flex: 1,
        height: 1,
        backgroundColor: '#ffffff'
    },
    separatorText: {
        marginHorizontal: 24,
        fontSize: 14
    }
});

export default styles;
