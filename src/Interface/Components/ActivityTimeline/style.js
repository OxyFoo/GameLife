import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    timelineContainer: {
        height: 16,
        width: '100%',
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(0,0,0,0.5)',
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,0.5)'
    },
    timelineItem: {
        flexDirection: 'row',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default styles;