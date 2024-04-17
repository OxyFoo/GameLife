import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    background: {
        width: '100%',
        paddingHorizontal: 16,
        backgroundColor: 'rgba(0,0,0,0.1)'
    },
    container: {
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
