import * as React from 'react';
import { View } from 'react-native';

import styles from './style';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

/**
 * @template {[data: any, closeReason: any]} T
 * @typedef {import('./back').PopupRenderType<T>} PopupRenderType
 */

/** @type {PopupRenderType<[{ title: string, message: string }, 'ok']>} */
function PopupTemplate_OK({ data, close }) {
    const lang = langManager.curr['modal'];

    return (
        <>
            <Text style={styles.title}>{data.title.toUpperCase()}</Text>
            <Text style={styles.message}>{data.message}</Text>
            <View style={styles.row}>
                <Button
                    style={[styles.button, styles.fillWidth]}
                    onPress={() => close('ok')}
                    color='main1'
                >
                    {lang['btn-ok']}
                </Button>
            </View>
        </>
    );
}

/** @type {PopupRenderType<[{ title: string, message: string }, 'yes' | 'no']>} */
function PopupTemplate_YesNo({ data, close }) {
    const lang = langManager.curr['modal'];

    return (
        <>
            <Text style={styles.title}>{data.title.toUpperCase()}</Text>
            <Text style={styles.message}>{data.message}</Text>
            <View style={styles.row}>
                <Button style={styles.button} onPress={() => close('no')} appearance='outline'>
                    {lang['btn-no']}
                </Button>
                <Button style={styles.button} onPress={() => close('yes')} appearance='normal'>
                    {lang['btn-yes']}
                </Button>
            </View>
        </>
    );
}

/** @type {PopupRenderType<[{ title: string, message: string }, 'accept' | 'refuse']>} */
function PopupTemplate_AcceptOrNot({ data, close }) {
    const lang = langManager.curr['modal'];

    return (
        <>
            <Text style={styles.title}>{data.title.toUpperCase()}</Text>
            <Text style={styles.message}>{data.message}</Text>
            <View style={styles.row}>
                <Button style={styles.button} onPress={() => close('refuse')} appearance='outline'>
                    {lang['btn-refuse']}
                </Button>
                <Button style={styles.button} onPress={() => close('accept')} appearance='normal'>
                    {lang['btn-accept']}
                </Button>
            </View>
        </>
    );
}

const POPUP_TEMPLATES = {
    ok: PopupTemplate_OK,
    yesno: PopupTemplate_YesNo,
    acceptornot: PopupTemplate_AcceptOrNot
};

export { POPUP_TEMPLATES };
