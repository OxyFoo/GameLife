import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    page:{
        height: "100%",
        width: "100%",
        padding:0,
    },
    flagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 12,
    },
    flagText: {
        marginLeft: 16
    },
    buttonNext: {
        height: 42,
        width: 125,
        marginTop: 24,
        paddingHorizontal: 16
    },
    buttonQuestion: {
        marginTop: 24,
        marginRight: 24,
        alignItems: "flex-end",
        justifyContent: "flex-end"
    }
});

export default styles;