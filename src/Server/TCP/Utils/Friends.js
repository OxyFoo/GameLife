/**
 * @typedef {import('../Classes/Users.js').User} User
 * @typedef {import('../Classes/Users.js').default} Users
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
    const command = `SELECT \`AccountID\`, \`TargetID\`, \`State\` FROM \`Friends\` WHERE AccountID = ${userID} OR TargetID = ${userID}`;
    const friendships = await users.db.ExecQuery(command);
    if (friendships === null) {
        throw new Error(`Friendships not found: ${userID}`);
    }

    /** @type {Array<Friend>} */
    const friends = [];
    for (let i = 0; i < friendships.length; i++) {
        const friendID = friendships[i].AccountID === userID ? friendships[i].TargetID : friendships[i].AccountID;
        const newFriend = await GetFriend(users, user, friendID, friendships[i].State);
        friends.push(newFriend);
    }
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
    // Get FriendshipState
    if (friendshipsState === null) {
        const commandState = `SELECT \`State\` FROM \`Friends\` WHERE (AccountID = ${user.accountID} AND TargetID = ${friendID}) OR (AccountID = ${friendID} AND TargetID = ${user.accountID})`;
        const requestState = await users.db.ExecQuery(commandState);
        if (requestState === null || requestState.length === 0) {
            throw new Error(`FriendshipState not found for account ${friendID}`);
        }
        friendshipsState = requestState[0]['State'];
    }

    // Get informations
    const commandInfo = `SELECT \`Username\`, \`Title\`, \`XP\` FROM \`Accounts\` WHERE ID = ${friendID}`;
    const friendInfo = await users.db.ExecQuery(commandInfo);
    if (friendInfo === null || friendInfo.length === 0) {
        throw new Error(`Account not found: ${friendID}`);
    }

    // Get avatar
    const commandAvatar = `SELECT \`Sexe\`, \`Skin\`, \`SkinColor\`, \`Hair\`, \`Top\`, \`Bottom\`, \`Shoes\` FROM \`Avatars\` WHERE ID = ${friendID}`;
    const friendAvatar = await users.db.ExecQuery(commandAvatar);
    if (friendAvatar === null || friendAvatar.length === 0) {
        throw new Error(`Avatar not found for account ${friendID}`);
    }

    const stuffKeys = [ 'Hair', 'Top', 'Bottom', 'Shoes' ];
    for (const key of stuffKeys) {
        // Get stuff by ItemID
        const commandItemID = `SELECT \`ItemID\` FROM \`Inventories\` WHERE ID = ${friendAvatar[0][key]}`;
        const itemID = await users.db.ExecQuery(commandItemID);
        if (itemID === null || itemID.length === 0) {
            throw new Error(`ItemID not found for account ${friendID}`);
        }
        friendAvatar[0][key] = itemID[0]['ItemID'];
    };

    /** @type {ConnectionState} */
    let friendStatus = 'offline';
    const index = users.AllUsers.findIndex(user => user.accountID === friendID);
    if (index !== -1) {
        friendStatus = 'online';
    }

    /** @type {Friend} */
    const newFriend = {
        status: friendStatus,
        accountID: friendID,
        username: friendInfo[0]['Username'],
        title: friendInfo[0]['Title'],
        xp: friendInfo[0]['XP'],
        avatar: friendAvatar[0],
        friendshipState: friendshipsState
    };

    return newFriend;
}

export { GetUserFriends, GetFriend };
