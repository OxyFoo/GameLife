import * as React from 'react';
import { View, Image, FlatList } from 'react-native';

import themeManager from 'Managers/ThemeManager';
import styles from './style';
import BackClassement from './back';

import { Page, Input, Button, Text } from 'Interface/Components';
import IMG_MUSIC from 'Ressources/logo/music/music';
import { rank_purple } from 'Ressources/items/rank/rank';

class Classement extends BackClassement {
    render() {

        const { sortSelectedIndex, search, playerData, allPlayersData } = this.state;
        const sortType = this.sortList[sortSelectedIndex];



        const renderItem = ({ item, index }) => {

            if (!item) return null;

            let isThisPlayer = false;
            if (playerData.accountID === item.accountID) isThisPlayer = true;

            let componentColor = { backgroundColor: themeManager.GetColor('darkBlue') };
            const rankTextColor = { color: themeManager.GetColor('main1') };

            if (isThisPlayer) {
                componentColor = { backgroundColor: themeManager.GetColor('black') };
            }


            let subTextValue;
            // ce gros truc la non plus c'est pas hyper hyper propre, peut etre faire un switch ? mais ca reviendrai au meme jsp comment faire bein propre 
            if (sortType === 'XP') {
                subTextValue = item.xp + ' XP';
            } else if (sortType === 'Skills') {
                subTextValue = item.activities.length + " activities";
            } else if (sortType === 'Int') {
                subTextValue = item.stats.intelligence + " Intelligence";
            } else if (sortType === 'For') {
                subTextValue = item.stats.force + " Force";
            } else if (sortType === 'Dex') {
                subTextValue = item.stats.dexterity + " Dexterity";
            } else if (sortType === 'Sta') {
                subTextValue = item.stats.stamina + " Stamina";
            } else if (sortType === 'Agi') {
                subTextValue = item.stats.agility + " Agility";
            } else if (sortType === 'Soc') {
                subTextValue = item.stats.social + " Social";
            }

            // peut etre faire un truc du genre, le state 'sort' stocke un string (xp, force, dex, etc..)
            // et on fait genre subTextValue = item.stats[sort] + " " + capitalizeFirstLetter(sort);
            // mais pas sûr parce que ca fait pas hyper propre de foutre un string dans le sort je trouve donc j'attend ton retour ! 

            return (
                <View style={[styles.itemContainer, componentColor]}>
                    <Image
                        style={styles.avatar}
                        source={IMG_MUSIC[item.accountID % IMG_MUSIC.length]} // Va falloir mettre les vraies images mais pour l'instant je met du fake 
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.username} color={'primary'} >{item.username}</Text>
                        <Text style={styles.details} color={'secondary'}>{subTextValue}</Text>
                    </View>
                    <View style={styles.rankContainer}>
                        <Image
                            style={styles.rankImage}
                            source={rank_purple}
                        />
                        <Text style={[styles.rankText, rankTextColor]} color={'main1'}>
                            {item.rank}{/* Sur lui, le color main1 sert à rien alors qu'il accepte les ThemeColor normalement c'est bizarre donc je le laisse mais j'ai aussi l'autre truc en plus au cas ou, pareil tu me diras */}
                        </Text>
                    </View>
                </View>
            );
        };

        return (
            <Page ref={ref => this.refPage = ref}>

                <View style={styles.myCharacterContainer}>
                    {playerData && renderItem({ item: playerData, index: -1 })}
                </View>

                <View style={[styles.filter, styles.row]}>
                    <Input
                        style={styles.inputSearch}
                        label={'[input search]'}
                        text={search}
                        onChangeText={this.onChangeSearch}
                    />
                    <Button
                        style={styles.buttonSortType}
                        borderRadius={8}
                        color='backgroundCard'
                        icon='filter'
                        onPress={this.onSwitchSort}
                    >
                        {sortType}
                    </Button>
                </View>

                <View style={styles.rankingList}>
                    <FlatList
                        data={allPlayersData}
                        renderItem={renderItem}
                        keyExtractor={item => item.accountID.toString()}
                    />
                </View>
            </Page>

        );

    }
}

export default Classement;
