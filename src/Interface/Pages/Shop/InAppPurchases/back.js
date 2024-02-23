import * as React from 'react';
import { Platform } from 'react-native';

import { renderItemPopup } from './popup';
import user from 'Managers/UserManager';
import dataManager from 'Managers/DataManager';
import themeManager from 'Managers/ThemeManager';

import { Character } from 'Interface/Components';

import {
  getProducts,
} from 'react-native-iap';

/**
 * @typedef {import('Data/Items').Item} Item
 * @typedef {import('Data/Items').CharacterContainerSize} CharacterContainerSize
 * 
 * @typedef BuyableItem
 * @property {string | number} ID
 * @property {string} Name
 * @property {number} Price
 * @property {number} Rarity
 * @property {string[]} Colors Colors from rarity
 * @property {string} BackgroundColor Background color
 * @property {Character} Character Character to display item
 * @property {CharacterContainerSize} Size Item size in pixels for the character
 * @property {() => void} OnPress
 */

const skus = Platform.select({
  ios: ['First_Ox_0_99', 'test_0_99_ox'],
  android: ['first_ox_0_99'],
});

class BackShopIAP extends React.Component {
  state = {
    /** @type {Array<BuyableItem>} */
    buyableItems: [],

    /** @type {Array<TODOItem>} */
    shopItems: []
  }

  purchaseUpdateSubscription = null;
  purchaseErrorSubscription = null;

  componentDidMount() {
    this.refreshIAP(); 
  }

  getAllIAP = async () => {
    getProducts({ skus }).then((items) => {
      console.log("[IAP] items", items);
      return (items);
    }).catch((error) => {
      console.error('Error fetching products:', error);
      user.interface.console.AddLog('error', `Error fetching products ${error}`);
    });
    return (null); 
  };

  refreshIAP = async () => {
    let allIAP = await this.getAllIAP();
    // TODO : REMOVE THE NEXT LINE, ONLY FOR LOCAL TESTING
    allIAP = [{ "countryCode": "USA", "currency": "USD", "description": "Ceci est une IAP test", "discounts": [], "introductoryPrice": "", "introductoryPriceAsAmountIOS": "", "introductoryPriceNumberOfPeriodsIOS": "", "introductoryPricePaymentModeIOS": "", "introductoryPriceSubscriptionPeriodIOS": "", "localizedPrice": "$0.99", "price": "0.99", "productId": "test_0_99_ox", "subscriptionPeriodNumberIOS": "0", "subscriptionPeriodUnitIOS": "", "title": "Test IAP", "type": "iap" }]

    if (allIAP === null) return;

    const iapItems = []; 
    allIAP.forEach((item, index) => {
      const iapItem = {
        ID: item.productId,
        Name: item.title,
        Price: item.price,
        localizedPrice: item.localizedPrice,
        Description: item.description,
        OnPress: () => this.openItemPopup(item)
      };
      iapItems.push(iapItem);
    });

    this.setState({ shopItems: iapItems });
  }

  /** @param {Item} item */
  openItemPopup = (item) => {
    const render = () => renderItemPopup.call(this, item);
    user.interface.popup.Open('custom', render);
  }
}

export default BackShopIAP;
