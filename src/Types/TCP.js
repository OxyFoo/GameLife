/**
 * @typedef {import('./UserOnline').Friend} Friend
 * @typedef {import('./NotificationInApp').NotificationInApp} NotificationInApp
 * @typedef {import('./UserOnline').CurrentActivity} CurrentActivity
 * 
 * @typedef {'idle' | 'connected' | 'disconnected' | 'error'} ConnectionState
 * @typedef {{ remaining: number, total: number }} ZapGPTState
 * 
 * 
 * 
 * ===== TCPClientRequest (client -> server) =====
 * 
 * @typedef {Object} SendRequestAddFriend
 * @property {'add-friend'} action
 * @property {string} username
 * @property {string} [callbackID]
 *
 * @typedef {Object} SendRequestRemoveFriend
 * @property {'remove-friend'} action
 * @property {number} accountID
 * @property {string} [callbackID]
 *
 * @typedef {Object} SendRequestAcceptFriend
 * @property {'accept-friend'} action
 * @property {number} accountID
 * @property {string} [callbackID]
 *
 * @typedef {Object} SendRequestDeclineFriend
 * @property {'decline-friend'} action
 * @property {number} accountID
 * @property {string} [callbackID]
 *
 * @typedef {Object} SendRequestCancelFriend
 * @property {'cancel-friend'} action
 * @property {number} accountID
 * @property {string} [callbackID]
 *
 * @typedef {Object} SendRequestBlockFriend
 * @property {'block-friend'} action
 * @property {number} accountID
 * @property {string} [callbackID]
 *
 * @typedef {Object} SendRequestStartActivity
 * @property {'start-activity'} action
 * @property {CurrentActivity} activity
 * @property {string} [callbackID]
 * 
 * @typedef {Object} SendRequestStopActivity
 * @property {'stop-activity'} action
 * @property {string} [callbackID]
 *
 * @typedef {Object} SendRequestZapGPT
 * @property {'zap-gpt'} action
 * @property {string} prompt
 * @property {string} [callbackID]
 * 
 * @typedef {Object} SendRequestGlobalMessage
 * @property {'global-message'} action
 * @property {number} ID Message ID in the database
 * @property {string} [response]
 * @property {string} [callbackID]
 * 
 * @typedef {SendRequestAddFriend | SendRequestRemoveFriend | SendRequestAcceptFriend | SendRequestDeclineFriend | SendRequestCancelFriend | SendRequestBlockFriend | SendRequestStartActivity | SendRequestStopActivity | SendRequestZapGPT | SendRequestGlobalMessage} TCPClientRequest
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
 * @typedef {Object} ReceiveRequestUpdateCurrentActivity
 * @property {'update-current-activity'} status
 * @property {CurrentActivity} activity
 * 
 * @typedef {Object} ReceiveRequestUpdateZapGPT
 * @property {'update-zap-gpt'} status
 * @property {ZapGPTState} zapGPTStatus
 * 
 * @typedef {Object} ReceiveRequestCallback
 * @property {'callback'} status
 * @property {string} callbackID
 * @property {any} result
 * 
 * @typedef {ReceiveRequestConnected | ReceiveRequestDisconnected | ReceiveRequestError | ReceiveRequestUpdateFriends | ReceiveRequestUpdateNotifications | ReceiveRequestUpdateCurrentActivity | ReceiveRequestUpdateZapGPT | ReceiveRequestCallback} TCPServerRequest
 */
