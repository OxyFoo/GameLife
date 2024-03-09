/**
 * @typedef {import('../Users.js').default} Users
 */

/**
 * @param {Users} users
 */
async function GetStats(users) {
    return {
        usersCount: users.AllUsers.length
    };
}

export { GetStats };
