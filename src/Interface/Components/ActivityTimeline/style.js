import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    timelineContainer2: {
        flexDirection: 'row',
        position: 'relative',
        height: 16,
        width: '100%',
        borderLeftWidth: 1,
        borderLeftColor: 'gray',
        borderRightWidth: 1,
        borderRightColor: 'gray',
    },
    timelineContainer: {
        height: 16,
        width: '100%',
        borderLeftWidth: 1,
        borderLeftColor: 'gray',
        borderRightWidth: 1,
        borderRightColor: 'gray',
    },
    timelineItem2: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timelineItem: {
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default styles;