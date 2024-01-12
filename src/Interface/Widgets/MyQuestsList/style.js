import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    questsContainer: {
        padding: 0
    },
    emptyText: {
        padding: 24
    },

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
        alignContent: 'center',
    },
    buttonInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 0,
        borderRadius: 0
    },

    separator: {
        width: 'auto',
        height: 1.5,
        marginHorizontal: 12,
        opacity: .5
    }
});

export default styles;
