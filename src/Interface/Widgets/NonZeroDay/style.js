import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Popup
    popup: {
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    popupFlatList: {
        height: 400,
        marginVertical: 12
    },
    popupText: {
        color: 'white',
        fontSize: 24
    },

    item: {
        marginTop: 12,
        padding: 6,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 8
    },
    content: {
        flexDirection: 'row',
        alignItems: 'stretch'
    },
    itemDay: {
        width: 'auto',
        maxWidth: 120,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 6
    },

    flatlistReward: {
        marginLeft: 12
    },
    flatlistRewardSeparation: {
        width: 6
    },
    itemReward: {
        aspectRatio: 1
    },

    itemState: {
        aspectRatio: 1,
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        margin: 12,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;
