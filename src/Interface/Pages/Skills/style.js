import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page: {
        height: '100%',
        paddingHorizontal: 24
    },

    // Categories
    categoriesContainer: {
        width: '100%',
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    secondaryTitleText: {
        marginBottom: 4,
        fontSize: 22,
        textAlign: 'left'
    },

    // Sort & Filter
    rowSort: {
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    buttonSortType: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 16
    },

    // Search button & input
    searchButton: {
        position: 'absolute',
        top: 32,
        right: 24,
        zIndex: 1000,
        elevation: 1000
    },
    searchbarView: {
        position: 'absolute',
        top: 0,
        right: 24,
        left: 24,
        zIndex: 1000,
        elevation: 1000
    },
    searchbarInput: {
        flex: 1,
        marginRight: 12
    },

    // Skills
    skillsFlatlist: {
        flex: 1
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
    },

    // Ascend/Descend button
    ascendView: {
        position: 'absolute',
        right: 24,
        bottom: 24
    },
    ascendButton: {
        width: 'auto',
        paddingVertical: 8,
        paddingHorizontal: 8
    }
});

export default styles;
