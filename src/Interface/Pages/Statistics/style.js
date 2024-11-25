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

    kpiContainer: {
        marginBottom: 24
    },
    kpiRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12
    },
    kpiCard: {
        minHeight: 90,
        paddingVertical: 12
    },
    kpiCardMiddle: {
        marginHorizontal: 12
    }
});

export default styles;
