import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        paddingHorizontal: 0,
        paddingBottom: 0
    },
    header: {
        paddingHorizontal: 32
    },

    parent: {
        alignItems: 'center',
        paddingHorizontal: 32
    },

    categoriesTitle: {
        marginBottom: 24,
        fontSize: 22
    },
    categoriesFlatlist: {
        width: '100%',
        marginBottom: 48
    },
    categoriesWrapper: {
        justifyContent: 'space-between'
    },
    category: {
        marginBottom: 8
    },
    categoryEmpty: {
        width: 44,
        height: 44
    },

    activitiesTitle: {
        marginBottom: 24,
        fontSize: 22
    },
    activitiesCombobox: {
        marginBottom: 48
    },

    panel: {
        padding: 32,
        borderRadius: 24,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    panelChild: {
        position: 'absolute',
        left: 0,
        right: 0
    },
    panelTextSwitch: {
        marginBottom: 24
    },

    commentView: {
        marginBottom: 48
    },
    commentButtonAdd: {
        height: 48,
        marginBottom: 48,
        marginHorizontal: 20
    },
    commentPanel: {
        padding: '5%',
        borderRadius: 24
    },
    commentText: {
        fontSize: 16,
        textAlign: 'left'
    }
});

export default styles;