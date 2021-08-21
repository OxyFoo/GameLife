import * as React from 'react';
import { View, Alert, StyleSheet, FlatList, TextInput } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import user from '../Managers/UserManager';
import langManager from '../Managers/LangManager';
import { twoDigit } from '../Functions/Functions';
import { GLBottomModal, GLHeader, GLText, GLTextEditable } from '../Components/GL-Components';

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
        birth: user.birth,
        email: user.email,
        title: user.title,

        modalEnabled: false,
        showDateTimePicker: ''
    }

    back = () => { user.changePage('home'); }
    valid = () => {
        // Check mail
        //if (!([ '', user.email ].includes(this.state.email))) {
        if (this.state.email !== '' && this.state.email !== user.email) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(this.state.email) === false) {
                console.error('Incorrect mail');
                return;
            }
        }
        
        user.pseudo = this.state.pseudo;
        user.title = this.state.title;
        user.birth = this.state.birth;
        user.email = this.state.email;

        user.changeUser();
        user.changePage('home');
    }

    // Pseudo
    beforeEditPseudo = () => {
        Alert.alert(
            "Changement de pseudo",
            "Vous ne pouvez changer de pseudo qu'une seule fois par mois, choisissez-bien !",
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
    editTitre = (newTitle) => {
        this.setState({ modalEnabled: false, title: newTitle });
    }
    component_titre = ({ item }) => {
        return (
            <GLText title={item} onPress={() => this.editTitre(item)} />
        )
    }

    // Age
    ageClick = () => {
        this.showDTP();
    }
    showDTP = () => {
        this.setState({ showDateTimePicker: 'date' });
    }
    hideDTP = () => {
        this.setState({ showDateTimePicker: '' });
    }
    onChangeDateTimePicker = (date) => {
        const YYYY = date.getFullYear();
        const MM = twoDigit(date.getMonth() + 1);
        const DD = twoDigit(date.getDate());
        const selectedDate = [ YYYY, MM, DD ].join('/');
        const age = this.calculateAge(selectedDate);
        
        if (age > 0) {
            this.hideDTP();
            this.setState({ birth: selectedDate });
        }
    }

    // Mails
    editMail = (newMail) => {
        if (newMail.length > 128) {
            return;
        }

        this.setState({ email: newMail.trim() });
    }

    calculateAge = (birth) => {
        const SelectedDate = new Date(birth);
        const Today = new Date().getTime();
        return new Date(Today - SelectedDate).getUTCFullYear() - 1970;
    }

    render() {
        const age = this.calculateAge(this.state.birth) || '?';
        const mode = this.state.showDateTimePicker;
        const totalDuration = user.getActivitiesTotalDuration();
        const totalTxt = (totalDuration/60) + 'h ' + (totalDuration % totalDuration/60) + 'm';

        return (
            <>
                <View style={{flex: 1}}>
                    {/* Header */}
                    <GLHeader
                        title={langManager.curr['identity']['page-title']}
                        leftIcon='back'
                        onPressLeft={this.back}
                        rightIcon='check'
                        onPressRight={this.valid}
                    />

                    {/* Content */}
                    <View style={styles.content}>
                        {/* Pseudo */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-pseudo'].toUpperCase()} />
                        <GLTextEditable
                            style={styles.value}
                            value={this.state.pseudo}
                            onChangeText={this.editPseudo}
                            beforeChangeText={this.beforeEditPseudo}
                            placeholder={langManager.curr['identity']['placeholder-pseudo']}
                        />

                        {/* Title */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-title'].toUpperCase()} />
                        <GLText style={styles.value} title={this.state.title || langManager.curr['identity']['empty-title']} onPress={this.toggleModal} color='grey' />

                        {/* Age */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-age'].toUpperCase()} />
                        <GLText style={styles.value} title={langManager.curr['identity']['value-age'].replace('{}', age)} onPress={this.ageClick} color='grey' />

                        {/* Email */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-email'].toUpperCase()} />
                        <GLText style={[styles.value, { marginBottom: 6 }]} title={user.conn.status} color='grey' />

                        {/* Email */}
                        <GLTextEditable
                            style={styles.value}
                            value={this.state.email}
                            defaultValue={langManager.curr['identity']['empty-email']}
                            onChangeText={this.editMail}
                            textContentType="emailAddress"
                            placeholder={langManager.curr['identity']['placeholder-email']}
                        />

                        {/* Total time */}
                        <GLText style={styles.text} title={langManager.curr['identity']['name-totaltime'].toUpperCase()} />
                        <GLText style={[styles.value, { marginBottom: 6 }]} title={totalTxt} color='grey' />
                    </View>

                    <GLBottomModal title='Titres' enabled={this.state.modalEnabled}>
                        <FlatList
                            data={TITRES}
                            keyExtractor={(item, i) => "titre_" + i}
                            renderItem={this.component_titre}
                        />
                    </GLBottomModal>
                </View>

                <DateTimePickerModal
                    date={new Date()}
                    mode={mode}
                    onConfirm={this.onChangeDateTimePicker}
                    onCancel={this.hideDTP}
                    isVisible={mode != ''}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: 24,
        paddingVertical: 48
    },
    containerPseudo: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between'
    },
    text: {
        textAlign: 'left',
        color: '#5AB4F0',
        fontSize: 24,
        marginBottom: 12
    },
    value: {
        textAlign: 'left',
        color: '#5AB4F0',
        fontSize: 22,
        marginBottom: 30
    }
});

export default Identity;