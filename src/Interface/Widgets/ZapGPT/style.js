import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    panel: {
        paddingTop: 12
    },
    globalCounter: {
        position: 'absolute',
        top: -6 - 26,
        left: 8
    },

    // Page 1 - Ask activities to ZapGPT
    title: {
        marginBottom: 12,
        paddingHorizontal: 24
    },
    texts: {
        marginBottom: 18,
        paddingLeft: 24,
        paddingRight: 12
    },
    text: {
        marginBottom: 6,
        textAlign: 'left'
    },
    input: {
        width: '100%',
        marginBottom: 24,
        paddingHorizontal: 24
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
        paddingHorizontal: 24
    },
    buttonClose: {
        width: '35%',
        borderRadius: 8
    },
    buttonAsk: {
        flex: 1,
        marginLeft: 12,
        borderRadius: 8
    },

    // Page 2 - Select & validate activities
    flatlistView: {
        maxHeight: Math.min(400, SCREEN_HEIGHT * .8 - 158),
        marginBottom: 12
    },
    separator: {
        width: '80%',
        height: .5,
        marginVertical: 6,
        marginHorizontal: '10%',
        opacity: .5
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12
    },
    itemText: {
        width: '80%'
    },
    itemRemove: {
        flex: 1,
        height: 'auto',
        aspectRatio: 1,
        margin: 6,
        paddingHorizontal: 0
    },

    buttons2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 12,
        marginBottom: 24,
        paddingHorizontal: 24
    },
    buttonBack: {
        width: '25%',
        height: 'auto',
        paddingVertical: 12,
        borderRadius: 8
    },
    buttonRetry: {
        width: '25%',
        height: 'auto',
        paddingVertical: 12,
        marginLeft: 12,
        borderRadius: 8
    },
    buttonValidate: {
        flex: 1,
        height: 'auto',
        paddingVertical: 12,
        marginLeft: 12,
        borderRadius: 8
    }
});

export default styles;
