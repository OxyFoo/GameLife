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
    }
});

export default styles;
