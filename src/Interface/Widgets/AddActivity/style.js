import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    parent: {
        height: '100%',
        paddingHorizontal: 24
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

    activitiesSearchBar: {
        width: '100%',
        paddingHorizontal: 0,
        marginBottom: 6
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
