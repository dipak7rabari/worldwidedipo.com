/**
 * @typedef {"open"|"in_progress"|"resolved"|"closed"} TicketStatus
 */

/**
 * @typedef {"general"|"payment"|"profile"|"account"|"technical"|"other"} TicketCategory
 */

/**
 * @typedef {Object} SupportTicket
 * @property {string} id
 * @property {string} userId
 * @property {string|null} profileId
 * @property {TicketCategory} category
 * @property {string} subject
 * @property {string} message
 * @property {TicketStatus} status
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export {};