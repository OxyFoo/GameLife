import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container:{
        borderRadius: 10,
        padding: 1,
        flex: 1,
        marginHorizontal: 5,

        justifyContent: 'center',
        alignItems: 'center',
        height: 100 // Example fixed height, adjust as necessary
    },
    value:{
        fontWeight: 'bold',
        margin: 0
    },
    title:{
        margin: 0
    }
});

export default styles;