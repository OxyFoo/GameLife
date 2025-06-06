import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    title: {
        marginTop: 32,
        marginBottom: 18,
        fontSize: 24,
        fontWeight: 'bold'
    },

    plannerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    plannerButton: {
        paddingHorizontal: 24
    },
    plannerButtonLeft: {
        flex: 1,
        marginRight: 6
    },
    plannerButtonRight: {
        flex: 1,
        marginLeft: 6
    },
    plannerButtonText: {
        flex: 1,
        fontSize: 16,
        textAlign: 'left'
    },

    starttime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24
    },
    stButtonLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 6,
        borderWidth: 1,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
        //backgroundColor: 'blue'
    },
    stLeftViewParent: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center'
        //marginLeft: 6,
        //backgroundColor: 'orange'
    },
    stViewLeftParent2: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
        //backgroundColor: 'yellow'
    },
    stDigitView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 6
        //backgroundColor: 'red'
    },
    stDigit: {
        marginVertical: 2,
        marginHorizontal: 6,
        borderWidth: 1,
        borderRadius: 4
    },
    stButtonRight: {
        width: 'auto',
        paddingLeft: 24,
        borderRadius: 0,
        justifyContent: 'center'
    },
    stButtonRightBackground: {
        borderLeftWidth: 0,
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
    },
    stButtonRightText: {
        marginRight: 12,
        fontSize: 16,
        textAlign: 'left'
    },

    // Input: Notifications
    notificationsAddButton: {
        marginTop: 24,
        paddingVertical: 14,
        paddingLeft: 16,
        paddingRight: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderWidth: 1
    },
    notificationsAddButtonContent: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    notifications: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24
    },
    notificationsContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 8,
        paddingVertical: 0,
        paddingLeft: 16,
        paddingHorizontal: 0
    },
    notificationsDigitView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 0
    },
    notificationDigit: {
        marginVertical: 2,
        marginHorizontal: 6,
        borderWidth: 1,
        borderRadius: 4
    },
    notificationRemoveBtn: {
        width: 'auto',
        height: '100%',
        paddingVertical: 14,
        paddingHorizontal: 0,
        paddingLeft: 18,
        paddingRight: 18
    },

    commentInputText: {
        minHeight: 120
    },
    commentInputTextContainer: {
        marginTop: 24
    },

    addActivityButton: {
        marginTop: 24
    },

    hintView: {
        position: 'absolute',
        transform: [{ translateY: '-50%' }],
        left: 8,
        paddingHorizontal: 6,
        zIndex: 999,
        elevation: 999
    },
    hintText: {
        fontSize: 12
    },
    hintBar: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 2,
        opacity: 0.9,
        backgroundColor: 'black'
    }
});

export default styles;
