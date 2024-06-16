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
        marginRight: 4,
        paddingHorizontal: 12,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 0
    },
    headerButtonRight: {
        marginLeft: 4,
        paddingHorizontal: 12,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 0
    },
    iconStaticHeader: {
        width: 'auto',
        height: 'auto',
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
    containerItem: {
        padding: 8
    },
    viewTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingHorizontal: 12
    },
    columnTitle: {
        minWidth: '33.33%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
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
        height: 'auto',
        paddingVertical: 10,
        marginVertical: 2,
        paddingHorizontal: 12
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
