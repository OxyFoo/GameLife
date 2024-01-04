import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page:{
        height: '100%',
        width: '100%',
        padding: 0,
        paddingBottom: 0,
    },
    langsContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    flagsContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    flagRow: {
        marginVertical: 12,
        flexDirection: 'row',
        alignItems: 'center'
    },
    flagText: {
        marginLeft: 16
    },

    buttonNext: {
        height: 42,
        width: 125,
        paddingHorizontal: 16
    },
    buttonQuestion: {
        position: 'absolute',
        top: 16,
        right: 16
    }
});

export default styles;
