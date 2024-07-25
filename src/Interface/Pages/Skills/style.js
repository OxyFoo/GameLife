import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        paddingHorizontal: 24
    },

    // Search
    inputSearch: {
        marginBottom: 24
    },

    // Sort & Filter
    rowSort: {
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonAscendType: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    },
    buttonSortType: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 16
    },

    // Categories
    categoryFlatlist: {
        marginBottom: 24,
        justifyContent: 'space-between'
    },
    secondaryTitleText: {
        marginBottom: 4,
        fontSize: 22,
        textAlign: 'left'
    },
    categoriesContainer: {
        width: '100%',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },

    // Skills
    skillsFlatlist: {
        //flex: 1
    },

    // Skills when empty
    emptyContent: {
        alignItems: 'center',
        padding: 12
    },
    emptyButtonAddActivity: {
        width: '50%',
        marginTop: 24,
        paddingVertical: 12
    }
});

export default styles;
