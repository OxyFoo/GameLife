import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { twoDigit } from '../../Functions/Functions';
import { OptionsAnimationSpring } from '../../Functions/Animations';

// Image dimensions
const MIN_WIDTH = 96;
const MAX_WIDTH = Dimensions.get('window').width - 48;

class Identity extends React.Component {
    state = {
        pseudo: user.pseudo,
        birth: user.birth,
        email: user.email,
        title: user.title,

        loading: false,
        showDateTimePicker: '',
        imageOpened: false,
        imageAnimation: new Animated.Value(MIN_WIDTH)
    }

    back = () => { user.backPage(); }
    async valid() {
        // Check mail
        //if (!([ '', user.email ].includes(this.state.email))) {
        if (this.state.email !== '' && this.state.email !== user.email) {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
            if (reg.test(this.state.email) === false) {
                const title = langManager.curr['identity']['alert-incorrectemail-title'];
                const text = langManager.curr['identity']['alert-incorrectemail-text'];
                user.openPopup('ok', [ title, text ]);
                return;
            }
        }

        if (user.pseudo !== this.state.pseudo) {
            user.pseudo = this.state.pseudo;
        }
        user.title = this.state.title;
        user.birth = this.state.birth;
        user.email = this.state.email;

        this.setState({ loading: true });
        await user.changeUser();
        user.backPage();
    }

    // Image
    imagePress = () => {
        const opened = this.state.imageOpened;
        this.setState({ imageOpened: !opened });
        const newDim = opened ? MIN_WIDTH : MAX_WIDTH;
        OptionsAnimationSpring(this.state.imageAnimation, newDim, false).start();
    }

    // Pseudo
    beforeEditPseudo = (textEditable_callback) => {
        const [ days_before_editable, days_total ] = user.daysBeforeChangePseudo();

        if (days_before_editable <= 0) {
            const title = langManager.curr['identity']['alert-pseudolimit-title'];
            const text = langManager.curr['identity']['alert-pseudolimit-text'].replace('{}', days_total);
            user.openPopup('ok', [ title, text ], textEditable_callback, false);
        } else {
            const title = langManager.curr['identity']['alert-pseudowait-title'];
            const text = langManager.curr['identity']['alert-pseudowait-text'].replace('{}', days_before_editable);
            user.openPopup('ok', [ title, text ], undefined);
        }
    }
    editPseudo = (newPseudo) => {
        // Conditions
        if (newPseudo.length > 16) {
            return;
        }

        this.setState({ pseudo: newPseudo });
    }

    // Titre
    editTitle = (newTitle) => {
        this.setState({ title: newTitle });
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
}

export default Identity;