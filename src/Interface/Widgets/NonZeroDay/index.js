import React from 'react';

import styles from './style';
import { RenderItemMemo } from './element';
import NonZeroDayBack from './back';
import langManager from 'Managers/LangManager';

import { Container, Text } from 'Interface/Components';

class NonZeroDay extends NonZeroDayBack {
    render() {
        const { claimIndex, claimDay } = this.state;
        const lang = langManager.curr['nonzerodays'];

        return (
            <Container
                style={this.props.style}
                styleContainer={styles.container}
                type='static'
                text={lang['container-title']}
                icon='arrowLeft'
                iconAngle={180}
                onIconPress={this.openPopup}
                colorNextGen
            >
                {claimIndex !== -1 ? (
                    <RenderItemMemo
                        index={claimDay}
                        claimIndex={claimIndex}
                        onPress={this.onClaimPress}
                    />
                ) : (
                    <Text style={styles.noClaim}>
                        {lang['no-claim']}
                    </Text>
                )}
            </Container>
        );
    }
}

export default NonZeroDay;
