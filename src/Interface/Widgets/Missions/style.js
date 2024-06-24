import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    buttonContainer: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 8
    },
    container: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        borderRadius: 8
    },

    columnZap: {
        justifyContent: 'center'
    },
    columnContent: {
        flex: 1,
        paddingTop: 8,
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
    text: {
        textAlign: 'left'
    },
    flatlist: {
        width: '100%',
        maxHeight: 18,
        marginTop: 4
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
    rewardCard: {
        width: 48,
        height: 48,
        borderRadius: 6,
        overflow: 'visible'
    },
    rewardItem: {
        width: 48,
        height: 48,
        padding: 6
    },
    rewardImage: {
        width: '100%',
        height: '100%'
    },
    rewardValue: {
        position: 'absolute',
        textAlign: 'right',
        left: -12,
        right: -12,
        bottom: -12
    }
});

export default styles;
