import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    // Container header
    headerStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        paddingHorizontal: 0
    },
    headerButtonLeft: {
        width: 'auto',
        marginRight: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 0
    },
    headerButtonRight: {
        width: 'auto',
        marginLeft: 4,
        paddingHorizontal: 12,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 0
    },
    iconStaticHeader: {
        width: 'auto',
        alignContent: 'center'
    },
    buttonInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 0,
        borderRadius: 0
    },

    // Container body
    bodyStyle: {
        paddingBottom: 6,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8
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

    viewProgression: {
        paddingHorizontal: 12
    },
    progressBar: {
        marginTop: 10
    },

    skillsItems: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12
    },
    skillItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12
    },
    skillButton: {
        width: 'auto',
        marginVertical: 2,
        paddingVertical: 10,
        paddingHorizontal: 10
    },

    viewFinished: {
        marginVertical: 6
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
    }
});

export default styles;
