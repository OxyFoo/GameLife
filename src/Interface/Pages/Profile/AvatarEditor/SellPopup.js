import * as React from 'react';
import { View, StyleSheet } from 'react-native';

import user from 'Managers/UserManager';
import langManager from 'Managers/LangManager';

import { Text, Button } from 'Interface/Components';

/**
 * @typedef {import('@oxyfoo/gamelife-types/Data/App/Items').Item} Item
 */

/** Sell price factor - player gets 75% of item value when selling */
const SELL_PRICE_FACTOR = 0.75;

/**
 * @param {Object} props
 * @param {number} props.stuffID - The stuff ID to sell
 * @param {Item} props.item - The item data
 * @param {() => void} props.onSold - Callback when item is sold successfully
 */
function SellPopup({ stuffID, item, onSold }) {
    const lang = langManager.curr['profile-avatar'];
    const langModal = langManager.curr['modal'];
    const [loading, setLoading] = React.useState(false);

    const sellPrice = Math.ceil(item.Value * SELL_PRICE_FACTOR);
    const itemName = langManager.GetText(item.Name);
    const message = lang['alert-sellconfirm-text'].replace('{}', sellPrice.toString());

    const handleNo = () => {
        user.interface.popup?.Close('no');
    };

    const handleYes = async () => {
        setLoading(true);
        user.interface.popup?.SetCancelable(false);

        const result = await user.inventory.SellStuff(stuffID);

        if (result === 'ok') {
            // Close this popup
            user.interface.popup?.Close('yes');

            // Notify parent
            onSold();

            // Show success message
            const successText = lang['alert-sellsuccess-text']
                .replace('{}', itemName)
                .replace('{}', sellPrice.toString());

            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-sellsuccess-title'],
                    message: successText
                }
            });
        } else if (result === 'item-equipped') {
            user.interface.popup?.Close('error');
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-isequipped-title'],
                    message: lang['alert-isequipped-text']
                }
            });
        } else {
            user.interface.popup?.Close('error');
            user.interface.popup?.OpenT({
                type: 'ok',
                data: {
                    title: lang['alert-sellfailed-title'],
                    message: lang['alert-sellfailed-text']
                }
            });
        }
    };

    return (
        <>
            <Text style={styles.title}>{lang['alert-sellconfirm-title'].toUpperCase()}</Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.row}>
                {!loading && (
                    <Button style={styles.button} onPress={handleNo} appearance='outline'>
                        {langModal['btn-no']}
                    </Button>
                )}
                <Button
                    style={loading ? styles.buttonFull : styles.button}
                    onPress={handleYes}
                    appearance='normal'
                    loading={loading}
                >
                    {langModal['btn-yes']}
                </Button>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        marginVertical: 24,
        paddingHorizontal: 8
    },
    message: {
        paddingHorizontal: 8,
        marginBottom: 12
    },
    row: {
        width: '100%',
        padding: 16,
        paddingBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    button: {
        width: '45%',
        borderRadius: 8
    },
    buttonFull: {
        width: '100%',
        borderRadius: 8
    }
});

export default SellPopup;
