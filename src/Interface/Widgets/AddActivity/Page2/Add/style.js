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
        marginRight: 6,
        justifyContent: 'center'
    },
    plannerButtonRight: {
        flex: 1,
        marginLeft: 6,
        justifyContent: 'center'
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
        paddingLeft: 24,
        paddingRight: 6,
        borderWidth: 1,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
        //backgroundColor: 'blue'
    },
    stLeftViewParent: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginLeft: 6
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

    commentInputText: {
        minHeight: 120
    },
    commentInputTextContainer: {
        marginTop: 24
    },

    addActivityButton: {
        marginTop: 24
    }
});

export default styles;
