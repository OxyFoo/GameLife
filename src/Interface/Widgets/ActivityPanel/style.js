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

    experience: {
        marginBottom: 48
    },

    container: {
        marginBottom: 48,
        padding: 4,
        borderRadius: 10
    },
    title: {
        marginBottom: 4
    },
    bonus: {
        position: 'absolute',
        top: 0,
        right: 0
    },

    addActivity: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0
    },
    buttonNow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        marginBottom: 24
    },
    zapGPT: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        marginBottom: 24
    },

    panel: {
        padding: 32
    },
    panelTitleView: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 48
    },
    panelTitle: {
        fontSize: 24
    },
    subPanelTitle: {
        fontSize: 14
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
    },
    buttonViewContainer: {
        height: 80,
        padding: 12,
        borderWidth: 3,
        borderStyle: 'solid',
        borderRadius: 15,
        backgroundColor: 'rgba(0,0,0,0.15)'
    },
    buttonView: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default styles;
