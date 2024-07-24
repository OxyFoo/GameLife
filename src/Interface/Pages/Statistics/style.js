import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 24
    },

    sectionTitle: {
        marginTop: 24,
        marginBottom: 16,
        fontSize: 21,
        textAlign: 'left',
        textTransform: 'uppercase'
    },

    sectionTitleGraph: {
        marginTop: 24,
        marginBottom: 16,
        fontSize: 16,
        textAlign: 'left'
    },

    kpiContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12
    },
    kpiProfile: {
        paddingVertical: 24
    },
    kpiProfileMiddle: {
        marginHorizontal: 12
    }
});

export default styles;
