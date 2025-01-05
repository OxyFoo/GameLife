import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    rewardItem: {
        width: 48,
        height: 48,
        padding: 6,
        marginHorizontal: 4,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible'
    },
    rewardImage: {
        width: '100%',
        height: '100%'
    },
    rewardValue: {
        position: 'absolute',
        left: -4,
        right: -4,
        bottom: -2,
        fontSize: 16
    }
});

export default styles;
