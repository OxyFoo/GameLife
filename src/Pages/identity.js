import * as React from 'react';
import { View, Alert, StyleSheet, FlatList } from 'react-native';

import { GLBottomModal, GLHeader, GLText, GLTextEditable } from '../Components/GL-Components';
import user from '../Managers/UserManager';

const TITRES = [
    'Test 1',
    'Test 2',
    'Test 3',
    'Test 4',
    'Test 5',
    'Test 6',
    'Test 7',
    'Test 8',
    'Test 9',
    'Test 10'
];

class Identity extends React.Component {
    state = {
        pseudo: user.pseudo,
        email: user.email,
        titre: user.titre,
        modalEnabled: false
    }

    back = () => { user.changePage('home'); }
    valid = () => {
        user.pseudo = this.state.pseudo;
        user.titre = this.state.titre;
        user.email = this.state.email;
        user.changePage('home');
    }

    // Pseudo
    beforeEditPseudo = () => {
        Alert.alert(
            'Changement de pseudo',
            'Vous ne pouvez changer de pseudo qu\'une seule fois par mois, choisissez-bien !',
            [{ text: 'Ok' }],
            //{ cancelable: false }
        );
    }
    editPseudo = (newPseudo) => {
        // Conditions
        if (newPseudo.length > 16) {
            return;
        }

        this.setState({ pseudo: newPseudo });
    }

    // Titre
    toggleModal = () => {
        this.setState({ modalEnabled: !this.state.modalEnabled });
    }
    editTitre = (newTitre) => {
        this.setState({ modalEnabled: false, titre: newTitre });
    }
    component_titre = ({ item }) => {
        return (
            <GLText title={item} onPress={() => this.editTitre(item)} />
        )
    }

    // Mails
    editMail = (newMail) => {
        if (newMail.length > 128) {
            return;
        }

        this.setState({ email: newMail });
    }
    

    render() {
        return (
            <View style={{flex: 1}}>
                {/* Header */}
                <GLHeader
                    title="Identité"
                    leftIcon='back'
                    onPressLeft={this.back}
                    rightIcon='check'
                    onPressRight={this.valid}
                />

                {/* Content */}
                <View style={style.content}>
                    <View style={style.containerPseudo}>
                        <GLText style={[style.text, style.pseudoTitle]} title='Pseudo :' />
                        <GLTextEditable
                            style={[style.text, style.pseudo]}
                            title={this.state.pseudo}
                            onEdit={this.editPseudo}
                            beforeEdit={this.beforeEditPseudo}
                        />
                    </View>
                    <GLText styleText={style.text} title='Titre :' value={this.state.titre} onPress={this.toggleModal} />
                    <GLText styleText={style.text} title='Age :' value='x ans' />
                    <View style={style.containerPseudo}>
                        <GLText style={[style.text, style.pseudoTitle]} title='Email :' />
                        <GLTextEditable
                            style={[style.text, style.pseudo]}
                            title={this.state.email}
                            onEdit={this.editMail}
                        />
                    </View>
                </View>

                <GLBottomModal title='Titres' enabled={this.state.modalEnabled}>
                    <FlatList
                        data={TITRES}
                        keyExtractor={(item, i) => "titre_" + i}
                        renderItem={this.component_titre}
                    />
                </GLBottomModal>
            </View>
        )
    }
}

const style = StyleSheet.create({
    content: {
        paddingHorizontal: 12,
        paddingVertical: 48
    },
    containerPseudo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    pseudoTitle: {
        paddingLeft: 24
    },
    pseudo: {
        fontSize: 20
    },
    text: {
        textAlign: 'left',
        color: '#5AB4F0',
        fontSize: 24,
        marginBottom: 12
    }
});

export default Identity;