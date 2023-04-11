import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    tempTitle: {
        marginBottom: 16,
        fontSize: 22
    },

    activitiesTitleView: {
        width: '100%',
        marginBottom: 24
    },
    activitiesTitle: {
        fontSize: 22
    },
    activitiesTitleIcon: {
        position: 'absolute',
        top: -8,
        right: 0,
        paddingHorizontal: 12,
        paddingBottom: 20
    },
    panel: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,

        padding: 32,
        borderRadius: 24,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    panelTitle: {
    },
    panelTextSwitch: {
        marginBottom: 24
    },

    commentView: {
        marginBottom: 48
    },
    commentButtonAdd: {
        height: 48,
        marginBottom: 48,
        marginHorizontal: 20
    },
    commentPanel: {
        padding: '5%',
        borderRadius: 24
    },
    commentText: {
        fontSize: 16,
        textAlign: 'left'
    }
});

export default styles;