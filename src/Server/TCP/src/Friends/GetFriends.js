/**
 * @typedef {import('../Users.js').User} User
 * @typedef {import('../Users.js').default} Users
 * @typedef {import('Types/Friend.js').Friend} Friend
 * @typedef {import('Types/Friend.js').ConnectionState} ConnectionState
 * @typedef {import('Types/Friend.js').FriendshipState} FriendshipState
 */

/**
 * @param {Users} users
 * @param {User} user
 * @returns {Promise<Array<Friend>>} Friends of the account
 */
async function GetUserFriends(users, user) {
    const userID = user.accountID;
    const command = `
        SELECT 
            f.AccountID, f.TargetID, f.State,
            a.Username, a.Title, a.XP,
            av.Sexe, av.Skin, av.SkinColor,
            hair.ItemID AS HairItemID,
            top.ItemID AS TopItemID,
            bottom.ItemID AS BottomItemID,
            shoes.ItemID AS ShoesItemID
        FROM Friends f
        JOIN Accounts a ON (f.AccountID = ${userID} AND f.TargetID = a.ID) OR (f.TargetID = ${userID} AND f.AccountID = a.ID)
        LEFT JOIN Avatars av ON a.ID = av.ID
        LEFT JOIN Inventories hair ON av.Hair = hair.ID
        LEFT JOIN Inventories top ON av.Top = top.ID
        LEFT JOIN Inventories bottom ON av.Bottom = bottom.ID
        LEFT JOIN Inventories shoes ON av.Shoes = shoes.ID
        WHERE (f.AccountID = ${userID} OR f.TargetID = ${userID}) AND (f.State = 'accepted' OR (f.AccountID = ${userID} AND f.State = 'pending'))
    `;
    const friendships = await users.db.ExecQuery(command);
    if (friendships === null) {
        throw new Error(`Friendships not found: ${userID}`);
    }

    /** @type {Array<Friend>} */
    const friends = friendships.map(/** @return {Friend} */ row => ({
        status: users.AllUsers.findIndex(u => u.accountID === row.AccountID) !== -1 ? 'online' : 'offline',
        accountID: row.AccountID === userID ? row.TargetID : row.AccountID,
        username: row.Username,
        title: row.Title,
        xp: row.XP,
        avatar: {
            Sexe: row.Sexe,
            Skin: row.Skin,
            SkinColor: row.SkinColor,
            Hair: row.HairItemID,
            Top: row.TopItemID,
            Bottom: row.BottomItemID,
            Shoes: row.ShoesItemID,
        },
        friendshipState: row.State,
        activities: {
            firstTime: 0,
            length: 0,
            totalDuration: 0
        }
    }));

    if (friends.length === 0) {
        return friends;
    }

    const friendIDs = friends.map(friend => friend.accountID);
    const activitiesQuery = `
        SELECT 
            AccountID,
            MIN(AddedTime) AS FirstActivity, 
            COUNT(*) AS TotalActivities, 
            SUM(Duration) AS TotalDuration
        FROM Activities
        WHERE AccountID IN (${friendIDs.join(',')})
        GROUP BY AccountID;
    `;
    const activitiesResults = await users.db.ExecQuery(activitiesQuery);
    if (activitiesResults === null) {
        throw new Error('Activities not found');
    }

    friends.forEach(friend => {
        const activity = activitiesResults.find(a => a.AccountID === friend.accountID);
        if (!activity) return;
        friend.activities = {
            firstTime: activity.FirstActivity,
            length: activity.TotalActivities,
            totalDuration: activity.TotalDuration,
        };
    });

    return friends;
}

/**
 * @param {Users} users
 * @param {User} user User of the account
 * @param {number} friendID ID of the friend
 * @param {FriendshipState} friendshipsState State of the friendship or null to define it automatically
 * @returns {Promise<Friend>} Friend of the account
 */
async function GetFriend(users, user, friendID, friendshipsState = null) {
    if (friendshipsState === null) {
        const commandState = `SELECT \`State\` FROM \`Friends\` WHERE (AccountID = ${user.accountID} AND TargetID = ${friendID}) OR (AccountID = ${friendID} AND TargetID = ${user.accountID})`;
        const requestState = await users.db.ExecQuery(commandState);
        if (requestState === null || requestState.length === 0) {
            throw new Error(`FriendshipState not found for account ${friendID}`);
        }
        friendshipsState = requestState[0]['State'];
    }

    const commandInfo = `
        SELECT 
            a.\`Username\`,
            a.\`Title\`,
            a.\`XP\`,
            av.\`Sexe\`,
            av.\`Skin\`,
            av.\`SkinColor\`,
            hairInv.\`ItemID\` AS \`HairItemID\`,
            topInv.\`ItemID\` AS \`TopItemID\`,
            bottomInv.\`ItemID\` AS \`BottomItemID\`,
            shoesInv.\`ItemID\` AS \`ShoesItemID\`,
            MIN(ac.\`AddedTime\`) AS \`FirstActivity\`,
            COUNT(*) AS \`TotalLength\`,
            SUM(\`Duration\`) AS \`TotalDuration\`
        FROM \`Accounts\` a
        LEFT JOIN \`Avatars\` av ON a.ID = av.ID
        LEFT JOIN \`Activities\` ac ON a.ID = ac.AccountID
        LEFT JOIN \`Inventories\` hairInv ON av.\`Hair\` = hairInv.ID
        LEFT JOIN \`Inventories\` topInv ON av.\`Top\` = topInv.ID
        LEFT JOIN \`Inventories\` bottomInv ON av.\`Bottom\` = bottomInv.ID
        LEFT JOIN \`Inventories\` shoesInv ON av.\`Shoes\` = shoesInv.ID
        WHERE a.ID = ${friendID}
    `;
    const friendInfo = await users.db.ExecQuery(commandInfo);
    if (friendInfo === null || friendInfo.length === 0) {
        throw new Error(`Account not found: ${friendID}`);
    }

    const friendStatus = users.AllUsers.findIndex(u => u.accountID === friendID) !== -1 ? 'online' : 'offline';

    /** @type {Friend} */
    const newFriend = {
        status: friendStatus,
        accountID: friendID,
        username: friendInfo[0]['Username'],
        title: friendInfo[0]['Title'],
        xp: friendInfo[0]['XP'],
        avatar: {
            Sexe: friendInfo[0]['Sexe'],
            Skin: friendInfo[0]['Skin'],
            SkinColor: friendInfo[0]['SkinColor'],
            Hair: friendInfo[0]['HairItemID'],
            Top: friendInfo[0]['TopItemID'],
            Bottom: friendInfo[0]['BottomItemID'],
            Shoes: friendInfo[0]['ShoesItemID'],
        },
        friendshipState: friendshipsState,
        activities: {
            firstTime: friendInfo[0]['FirstActivity'],
            length: friendInfo[0]['TotalLength'],
            totalDuration: friendInfo[0]['TotalDuration']
        }
    };

    return newFriend;
}

export { GetUserFriends, GetFriend };
