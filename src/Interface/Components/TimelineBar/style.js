import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16
    },
    timelineContainer: {
        flexDirection: 'row',
        position: 'relative',
        height: 16,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    timelineItem: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default styles;