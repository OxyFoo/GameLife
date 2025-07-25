import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        width: '100%',
        height: 12,
        borderRadius: 20,
        backgroundColor: '#00000050'
    },
    timelineItem: {
        flexDirection: 'row',
        borderWidth: 2,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    adjacentLeft: {
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    adjacentRight: {
        borderRightWidth: 0,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
    },
    currentTimeIndicator: {
        position: 'absolute',
        top: -2,
        width: 2,
        height: 16,
        borderRadius: 1,
        zIndex: 10
    }
});

export default styles;
