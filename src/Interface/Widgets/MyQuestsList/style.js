import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    questsContainer: {
        padding: 0
    },
    emptyText: {
        padding: 24
    },


    headerStyle: {
        justifyContent: 'space-between',
        paddingHorizontal: 0
    },
    iconStaticHeader: {
        width: 'auto',
        height: 'auto',
        alignContent: 'center',
        padding: 12,
    },
    buttonInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingLeft: 0,
        borderRadius:0
    },

    separator: {
        width: 'auto',
        height: 1.5,
        marginHorizontal: 12,
        opacity: .5
    }
});

export default styles;
