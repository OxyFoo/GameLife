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
    /**
     * @param {Icons} icon
     * @param {() => void} onPress
     */
    renderHeader = (icon, onPress) => {
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
                    <Icon
                        containerStyle={styles.iconStaticHeader}
                        icon={'info'}
                        size={24}
                        onPress={StartHelp.bind(this)}
                    />
                    <Text color={'primary'}>
                        {lang['container-title']}
                    </Text>
                </View>
                {icon !== null && (
                    <Icon
                        ref={ref => this.refMore = ref}
                        containerStyle={styles.iconStaticHeader}
                        icon={icon}
                        size={24}
                        angle={180}
                        onPress={() => onPress}
                    />
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
                styleContent={styles.container}
                colorNextGen
            >
                <SimpleContainer.Header>
                    {this.renderHeader('arrowLeft', this.openPopup)}
                </SimpleContainer.Header>

                <SimpleContainer.Body>
                    {this.renderBody(claimIndex, claimDay)}
                </SimpleContainer.Body >

            </SimpleContainer >
        );
    }
}

export default NonZeroDay;
