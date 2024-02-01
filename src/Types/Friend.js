class Friend {
    /** @type {'online' | 'offline'} */
    status = 'offline';
    accountID = 0;
    username = '';
    avatar = '';
    /** @type {'accepted' | 'pending' | 'blocked'} */
    friendshipState = 'pending';
}

export { Friend };
