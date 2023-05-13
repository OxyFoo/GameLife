import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'space-between'
    },
    pageHeader: {
        marginBottom: 24
    },

    headerVersion: {
        marginBottom: 12
    },
    headerTitle: {
        marginBottom: 12
    },
    headerRow: {
        display: 'flex',
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    contributorsView:  {
        flex: 1,
        paddingVertical: 24
    },
    contributorsText: {
        marginBottom: 12
    },
    contributorsFlatlist: {
        flex: 1,
        borderWidth: 3,
        borderColor: '#FFFFFF'
    },

    footerText: {
        marginBottom: 12
    },
    footerRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    }
});

export default styles;