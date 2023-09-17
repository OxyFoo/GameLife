import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    tempTitle: {
        marginBottom: 16,
        fontSize: 22
    },
    tempTitleNoXP: {
        marginBottom: 48,
        fontSize: 22
    },

    activitySchedule: {
        zIndex: 800,
        elevation: 800
    },

    buttonNow: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        marginBottom: 24
    },

    panel: {
        padding: 32
    },
    panelTitleView: {
        width: '100%',
        marginBottom: 48
    },
    panelTitle: {
        fontSize: 26
    },
    panelTitleIcon: {
        position: 'absolute',
        top: -4,
        right: 4,
        paddingHorizontal: 12,
        paddingBottom: 20
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