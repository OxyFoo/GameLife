import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    panel: {
        paddingBottom: 12
    },

    // Page 1 - Ask activities to ZapGPT
    title: {
        marginTop: 6,
        marginBottom: 6,
        paddingHorizontal: 24
    },
    texts: {
        marginBottom: 18
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
    buttonAsk: {
        flex: 1,
        borderRadius: 8
    },
    noRemaining: {
        alignItems: 'center',
        paddingTop: 12,
        marginBottom: 24,
        marginHorizontal: 12
    },
    noRemainingText: {
        textAlign: 'center',
        marginBottom: 24
    },
    noRemainingBack: {
        width: '100%',
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    noRemainingZap: {
        width: 86,
        height: 86,
        transform: [{ scaleX: -1 }]
    },

    notBuyed: {
        width: '100%',
        marginTop: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    notBuyedText1: {
        marginTop: 6,
        marginBottom: 6
    },
    notBuyedText2Container: {
        flex: 1
    },
    notBuyedText2: {
        textAlign: 'justify',
        verticalAlign: 'middle'
    },

    // Page 2 - Select & validate activities
    flatlistView: {
        marginBottom: 12
    },
    separator: {
        width: '80%',
        height: 0.5,
        marginVertical: 6,
        marginHorizontal: '10%',
        opacity: 0.5
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
