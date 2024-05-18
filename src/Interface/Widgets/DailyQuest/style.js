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
    itemSkill: {
        marginLeft: 48,
        textAlign: 'left'
    }
});

export default styles;
