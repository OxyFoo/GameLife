import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 24
    },

    sectionTitle: {
        marginBottom: 16,
        fontSize: 21,
        textAlign: 'left',
        textTransform: 'uppercase'
    },

    activitiesChart: {
        marginBottom: 24
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
