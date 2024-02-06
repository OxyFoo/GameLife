/**
 * @typedef {import('./Friend').Friend} Friend
 * @typedef {import('./NotificationInApp').NotificationInApp} NotificationInApp
 * 
 * @typedef {'idle' | 'connected' | 'disconnected' | 'error'} ConnectionState
 * 
 * 
 * 
 * ===== TCPClientRequest (client -> server) =====
 * 
 * @typedef {Object} SendRequestAddFriend
 * @property {'add-friend'} action
 * @property {string} username
 *
 * @typedef {Object} SendRequestRemoveFriend
 * @property {'remove-friend'} action
 * @property {number} accountID
 *
 * @typedef {Object} SendRequestAcceptFriend
 * @property {'accept-friend'} action
 * @property {number} accountID
 *
 * @typedef {Object} SendRequestDeclineFriend
 * @property {'decline-friend'} action
 * @property {number} accountID
 *
 * @typedef {Object} SendRequestBlockFriend
 * @property {'block-friend'} action
 * @property {number} accountID
 * 
 * @typedef {SendRequestAddFriend | SendRequestRemoveFriend | SendRequestAcceptFriend | SendRequestDeclineFriend | SendRequestBlockFriend} TCPClientRequest
 * 
 * 
 * 
 * ===== TCPServerRequest (server -> client) =====
 * 
 * @typedef {Object} ReceiveRequestConnected
 * @property {'connected'} status
 * 
 * @typedef {Object} ReceiveRequestDisconnected
 * @property {'disconnected'} status
 * 
 * @typedef {Object} ReceiveRequestError
 * @property {'error'} status
 * @property {string} message
 *  
 * @typedef {Object} ReceiveRequestUpdateFriends
 * @property {'update-friends'} status
 * @property {Array<Friend>} friends
 * 
 * @typedef {Object} ReceiveRequestUpdateNotifications
 * @property {'update-notifications'} status
 * @property {Array<NotificationInApp>} notifications
 * 
 * @typedef {ReceiveRequestConnected | ReceiveRequestDisconnected | ReceiveRequestError | ReceiveRequestUpdateFriends | ReceiveRequestUpdateNotifications} TCPServerRequest
 */
