import * as React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';

import { GLHeader, GLText } from '../Components/GL-Components';
import langManager from '../Managers/LangManager';
import user from '../Managers/UserManager';

class Characteristics extends React.Component {
    componentDidMount() {
        const allCaracs = Object.keys(langManager.currentLangage['caracs']);
        console.log(allCaracs);
    }

    open = (arg) => {
        user.changePage('charactescription', [ arg ]);
    }
    back = () => { user.changePage('home'); }

    showCarac = ({item}) => {
        return (
            <GLText style={style.text} onPress={() => { this.open(item) }} title={'X1   ' + item} />
        )
    }

    render() {
        const allCaracs = Object.keys(langManager.currentLangage['caracs']);

        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Caracs"
                    leftIcon='back'
                    onPressLeft={this.back}
                />

                {/* Content */}
                <FlatList
                    style={style.content}
                    data={allCaracs}
                    keyExtractor={(item, i) => 'carac_' + i}
                    renderItem={this.showCarac}
                />
            </View>
        )
    }
}

const style = StyleSheet.create({
    content: {
        width: '100%',
        height: '90%',
        paddingHorizontal: 24,
        marginTop: 24
    },
    text: {
        textAlign: 'left',
        fontSize: 28,
        color: '#55AFF0',
        marginVertical: 12
    }
});

export default Characteristics;