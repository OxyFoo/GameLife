import * as React from 'react';
import { Animated, Dimensions } from 'react-native';

import user from '../../Managers/UserManager';
import langManager from '../../Managers/LangManager';
import { twoDigit } from '../../Functions/Functions';
import { SpringAnimation } from '../../Functions/Animations';

// Image dimensions
const MIN_WIDTH = 96;
const MAX_WIDTH = Dimensions.get('window').width - 48;

class BackIdentity extends React.Component {
    state = {
        username: user.username,
        birth: user.birth,
        title: user.title,

        loading: false,
        showDateTimePicker: '',
        imageOpened: false,
        imageAnimation: new Animated.Value(MIN_WIDTH)
    }

    back = () => { user.interface.backPage(); }
    async valid() {
        if (user.username !== this.state.username) {
            user.username = this.state.username;
        }
        user.title = this.state.title;
        user.birth = this.state.birth;

        this.setState({ loading: true });
        // TODO - Save
        user.interface.backPage();
    }

    // Image
    imagePress = () => {
        const opened = this.state.imageOpened;
        this.setState({ imageOpened: !opened });
        const newDim = opened ? MIN_WIDTH : MAX_WIDTH;
        SpringAnimation(this.state.imageAnimation, newDim, false).start();
    }

    // Pseudo
    beforeEditPseudo = (textEditable_callback) => {
        const [ days_before_editable, days_total ] = user.daysBeforeChangePseudo();

        if (days_before_editable <= 0) {
            const title = langManager.curr['identity']['alert-pseudolimit-title'];
            const text = langManager.curr['identity']['alert-pseudolimit-text'].replace('{}', days_total);
            user.interface.popup.Open('ok', [ title, text ], textEditable_callback, false);
        } else {
            const title = langManager.curr['identity']['alert-pseudowait-title'];
            const text = langManager.curr['identity']['alert-pseudowait-text'].replace('{}', days_before_editable);
            user.interface.popup.Open('ok', [ title, text ], undefined);
        }
    }
    editPseudo = (newUsername) => {
        // Conditions
        if (newUsername.length > 16) {
            return;
        }

        this.setState({ username: newUsername });
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

    calculateAge = (birth) => {
        const SelectedDate = new Date(birth);
        const Today = new Date().getTime();
        return new Date(Today - SelectedDate).getUTCFullYear() - 1970;
    }
}

export default BackIdentity;