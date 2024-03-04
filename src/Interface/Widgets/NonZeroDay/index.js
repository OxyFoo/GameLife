import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import styles from './style';
import StartHelp from './help';
import NonZeroDayBack from './back';
import { RenderItemMemo } from './element';

import langManager from 'Managers/LangManager';

import { SimpleContainer, Text, Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('Class/Shop').Icons} Icons
 */

class NonZeroDay extends NonZeroDayBack {
    renderHeader = () => {
        const lang = langManager.curr['nonzerodays'];
        const titleColors = ['#384065', '#B83EFFE3'];

        /** @type {Icons} */
        let icon = 'arrowLeft';
        let onPress = this.openPopup;

        return (
            <LinearGradient
                colors={titleColors}
                start={{ x: 0, y: -2 }} end={{ x: 1, y: 2 }}
                style={styles.headerStyle}
            >
                <View style={styles.buttonInfo}>
                    <Button
                        style={styles.headerButtonLeft}
                        onPress={StartHelp.bind(this)}
                    >
                        <Icon
                            containerStyle={styles.iconStaticHeader}
                            icon={'info'}
                            size={24}
                        />
                    </Button>
                    <Text color={'primary'}>
                        {lang['container-title']}
                    </Text>
                </View>

                {icon !== null && (
                    <Button
                        ref={ref => this.refOpenStreakPopup = ref}
                        style={styles.headerButtonRight}
                        onPress={onPress}
                    >
                        <Icon
                            containerStyle={styles.iconStaticHeader}
                            icon={icon}
                            size={24}
                            angle={180}
                        />
                    </Button>
                )}
            </LinearGradient>
        )
    }

    renderBody = () => {
        const lang = langManager.curr['nonzerodays'];
        const { claimIndex, claimDay, claimDate } = this.state;

        if (claimIndex === -1) {
            return (
                <Text style={styles.noClaim}>
                    {lang['no-claim']}
                </Text>
            );
        }

        return (
            <>
                {/* Claim date if not last streak */}
                {claimDate !== null && (
                    <Text style={styles.containerDateText}>
                        {lang['container-date'].replace('{}', claimDate)}
                    </Text>
                )}
    
                {/* Claim day */}
                <RenderItemMemo
                    index={claimDay}
                    claimIndex={claimIndex}
                    handleClaim={this.onClaimPress}
                />
            </>
        );
    }

    render() {
        return (
            <SimpleContainer
                ref={ref => this.refContainer = ref}
                style={this.props.style}
            >
                <SimpleContainer.Header>
                    {this.renderHeader()}
                </SimpleContainer.Header>

                <SimpleContainer.Body style={styles.containerItem}>
                    {this.renderBody()}
                </SimpleContainer.Body>
            </SimpleContainer>
        );
    }
}

export default NonZeroDay;
