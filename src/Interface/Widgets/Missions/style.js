import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Container
    buttonContainer: {
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 8,
        marginTop: 12
    },
    gradient: {
        flexDirection: 'row'
    },
    container: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12
    },

    // Left: Zap
    zapContainer: {
        justifyContent: 'center'
    },
    zap: {
        //width: 64,
    },

    // Middle: Content
    columnContent: {
        flex: 1,
        marginHorizontal: 8,
        justifyContent: 'space-between'
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

    // Right: Reward
    columnReward: {
        paddingHorizontal: 8,
        justifyContent: 'flex-end'
    },
    rewardCard: {
        width: 48,
        height: 56,
        borderRadius: 6,
        overflow: 'visible'
    },
    rewardItem: {
        width: 48,
        height: 56,
        padding: 6
    },
    rewardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    rewardIconContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rewardImage: {
        width: '100%',
        height: '100%'
    },
    rewardPreview: {
        width: 18,
        marginHorizontal: 2,
        padding: 2,
        aspectRatio: 1,
        borderRadius: 100
    },
    rewardValue: {
        textAlign: 'center'
    },
    missionStep: {
        textAlign: 'center',
        marginTop: 8
    }
});

export default styles;
