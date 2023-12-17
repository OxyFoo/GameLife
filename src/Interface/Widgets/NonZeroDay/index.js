import React from 'react';

import styles from './style';
import user from 'Managers/UserManager';
import NonZeroDayBack from './back';
import langManager from 'Managers/LangManager';

import { Container, Text } from 'Interface/Components';

class NonZeroDay extends NonZeroDayBack {
    render() {
        const lang = langManager.curr['nonzerodays'];
        const combo = user.quests.nonzerodays.GetConsecutiveDays();

        return (
            <Container
                style={this.props.style}
                type='static'
                text={lang['container-title']}
                icon='arrowLeft'
                iconAngle={180}
                onIconPress={this.openPopup}
            >
                <Text>{`[Non Zero Days => ${combo}]`}</Text>
            </Container>
        );
    }
}

export default NonZeroDay;
