import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    header: {
        marginBottom: 24
    },

    textTitle: {
        marginBottom: 4,
        fontSize: 20,
        textAlign: 'left'
    },
    categoriesContainer: {
        alignItems: 'center'
    },
    categoriesScrollView: {
        maxWidth: '100%',
        marginBottom: 18
    },
    category: {
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
        marginHorizontal: 0,
        marginBottom: 6,
        padding: 8,
        borderRadius: 8,
        overflow: 'hidden'
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
