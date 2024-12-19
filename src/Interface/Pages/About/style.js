import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 24
    },
    pageContent: {
        minHeight: '100%'
    },

    pageHeader: {
        marginBottom: 24
    },
    title: {
        marginBottom: 12,
        textAlign: 'center',
        fontSize: 28
    },

    // Header
    headerImage: {
        width: '50%',
        height: 100,
        alignSelf: 'center',
        borderRadius: 12
    },
    headerVersion: {
        marginBottom: 24
    },

    // Team
    teamRow: {
        display: 'flex',
        marginBottom: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    // Contributors
    contributorsView: {
        flex: 1,
        paddingVertical: 24
    },
    contributorsText: {
        marginBottom: 12,
        fontSize: 22
    },
    contributorsSubText: {
        textAlign: 'justify'
    },

    // Links
    footerText: {
        marginBottom: 24
    },
    iconsRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: 6,
        marginBottom: 32
    }
});

export default styles;
