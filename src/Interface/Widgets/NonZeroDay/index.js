import React from 'react';
import { View } from 'react-native';

import styles from './style';
import { RenderItemMemo } from './element';
import NonZeroDayBack from './back';
import StartHelp from './help';

import langManager from 'Managers/LangManager';

import { SimpleContainer, Text, Button, Icon } from 'Interface/Components';

/**
 * @typedef {import('Class/Shop').Icons} Icons
 */

class NonZeroDay extends NonZeroDayBack {


    renderHeader = () => {

        /** @type {Icons} */
        let icon = 'arrowLeft';
        let onPress = this.openPopup;

        const lang = langManager.curr['nonzerodays'];
        const headerStatic = (
            <Button
                style={styles.headerStyle}
                colorNextGen={true}
                rippleColor='transparent'
                borderRadius={8}
                pointerEvents='box-none'
            >
                <View style={styles.buttonInfo}>
                    <Button onPress={StartHelp.bind(this)} style={styles.iconButtonPadding}>
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
                    <Button onPress={onPress}  style={styles.iconButtonPadding}>
                    <Icon
                        ref={ref => this.refFullStreak = ref}
                        containerStyle={styles.iconStaticHeader}
                        icon={icon}
                        size={24}
                        angle={180}
                    />
                    </Button>
                )}
            </Button>
        );
        return headerStatic
    }

    renderBody = (claimIndex, claimDay) => {
        const lang = langManager.curr['nonzerodays'];

        const body = claimIndex !== -1 ? (
            <RenderItemMemo
                index={claimDay}
                claimIndex={claimIndex}
                onPress={this.onClaimPress}
                style={styles.container}
            />
        ) : (
            <Text style={styles.noClaim}>
                {lang['no-claim']}
            </Text>
        );

        return body;
    }

    render() {
        const { claimIndex, claimDay } = this.state;

        return (
            <SimpleContainer
                ref={ref => this.refContainer = ref}
                style={this.props.style}
            >
                <SimpleContainer.Header>
                    {this.renderHeader()}
                </SimpleContainer.Header>

                <SimpleContainer.Body>
                    {this.renderBody(claimIndex, claimDay)}
                </SimpleContainer.Body >

            </SimpleContainer >
        );
    }
}

export default NonZeroDay;
