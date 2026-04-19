import { StyleSheet } from 'react-native';

const sharedStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    chartMarginRight: {
        marginRight: 12
    },
    chartMarginLeft: {
        marginLeft: 12
    },
    chartCenter: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    chartCenterText: {
        fontWeight: 'bold'
    },
    dataList: {
        flex: 1,
        overflow: 'hidden'
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 4,
        textAlign: 'left',
        textTransform: 'uppercase',
        letterSpacing: 1
    }
});

export default sharedStyles;
