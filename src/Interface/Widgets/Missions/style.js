import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    buttonContainer: {
        height: 'auto',
        paddingHorizontal: 0
    },
    container: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        borderRadius: 12
    },

    columnZap: {
        justifyContent: 'center'
    },
    columnContent: {
        flex: 1,
        paddingBottom: 8,
        marginHorizontal: 8,
        justifyContent: 'space-between'
    },
    columnReward: {
        justifyContent: 'space-evenly',
        marginTop: 24
    },

    zap: {
        width: 64
    },
    title: {
        width: '200%',
        textAlign: 'left',
        flexWrap: 'nowrap'
    },
    text: {
        textAlign: 'left'
    },
    flatlist: {
        width: '100%',
        maxHeight: 18
    },
    flatlistContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    rewardPreview: {
        width: 18,
        marginHorizontal: 2,
        padding: 2,
        aspectRatio: 1,
        borderRadius: 100
    },
    rewardItem: {
        width: 48,
        height: 48,
        padding: 6,
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
        textAlign: 'right',
        left: -28,
        right: -28,
        bottom: -12
    }
});

export default styles;
