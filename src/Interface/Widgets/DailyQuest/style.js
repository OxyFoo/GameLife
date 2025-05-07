import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Container header
    headerStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    headerButtonRight: {
        width: 'auto',
        marginLeft: 4,
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 0
    },
    iconStaticHeader: {
        width: 'auto',
        alignContent: 'center'
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 16,
        paddingVertical: 8,
        borderRadius: 0
    },

    // Container body
    bodyStyle: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    bodyContent: {
        paddingBottom: 12
    },
    viewTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingHorizontal: 12
    },
    columnTitle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        marginHorizontal: 8,
        fontSize: 14
    },

    viewCategory: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleCategory: {
        fontSize: 14
    },
    iconCategory: {
        marginRight: 8
    },

    viewProgression: {
        paddingHorizontal: 12
    },
    progressBar: {
        marginTop: 10
    },

    viewFinished: {
        marginTop: 12
    },
    dailyFinished: {
        marginTop: 12,
        marginLeft: 12,
        marginRight: 12
    },
    buttonClaim: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginHorizontal: 4
    },
    containerDateText: {
        marginBottom: 12,
        fontSize: 14
    },

    viewNoInternet: {
        marginTop: 12,
        paddingHorizontal: 12
    },
    textNoInternet: {}
});

export default styles;
