import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        height: '100%',
        paddingHorizontal: 24
    },

    // Search bar
    searchBar: {
        position: 'absolute',
        top: 30,
        left: 24,
        right: 24,
        paddingHorizontal: 0,
        marginBottom: 6
    },
    searchButton: {
        width: 'auto',
        paddingVertical: 12,
        paddingHorizontal: 12
    },
    searchTextInput: {
        paddingRight: 48
    },
    searchIconButton: {
        position: 'absolute',
        right: 0,
        width: 'auto',
        paddingVertical: 6,
        paddingHorizontal: 6
    },

    // Title
    titleParent: {
        overflow: 'hidden'
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 36,
        marginBottom: 24
    },
    primaryTitleText: {
        marginBottom: 4,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center'
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
    category: {
        flex: 1,
        paddingHorizontal: 0,
        marginVertical: 4,
        marginHorizontal: 4
    },
    categoryEmpty: {
        width: 44,
        height: 44
    },
    activitiesFlatlist: {
        width: '100%',
        height: '100%'
    },
    activityElement: {
        marginVertical: 4,
        paddingVertical: 16,
        paddingHorizontal: 16
    },

    emptyList: {
        marginTop: 24
    },
    emptyListText: {
        textAlign: 'center',
        fontSize: 24
    }
});

export default styles;
