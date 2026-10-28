import { StyleSheet } from 'react-native';

/** Side of the default slot */
const REWARD_SLOT = 48;

/** Geometry of the amount label, drawn for the default slot: `Reward` scales it with the slot */
const REWARD_LABEL = {
    left: -4,
    right: -4,
    bottom: -6,
    fontSize: 16
};

const styles = StyleSheet.create({
    rewardItem: {
        width: REWARD_SLOT,
        height: REWARD_SLOT,
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
        ...REWARD_LABEL
    }
});

export default styles;
export { REWARD_SLOT, REWARD_LABEL };
