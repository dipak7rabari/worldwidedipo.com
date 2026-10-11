/**
 * @typedef {Object} ProfileLinks
 * @property {string|null} website
 * @property {string|null} instagram
 * @property {string|null} youtube
 * @property {string|null} facebook
 * @property {string|null} linkedin
 * @property {string|null} x
 * @property {string|null} whatsapp
 * @property {string|null} phone
 */

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} ownerId
 * @property {string} name
 * @property {string} slug
 * @property {string} profession
 * @property {string} bio
 * @property {string|null} avatarUrl
 * @property {ProfileLinks} links
 * @property {"starter"|"pro"|"elite"} plan
 * @property {"draft"|"pending"|"active"|"expired"} status
 * @property {string|null} expiresAt
 * @property {string|null} deletionScheduledAt
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} PublicProfile
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string} profession
 * @property {string} bio
 * @property {string|null} avatarUrl
 * @property {ProfileLinks} links
 * @property {"starter"|"pro"|"elite"} plan
 * @property {"active"} status
 * @property {string|null} expiresAt
 * @property {string} createdAt
 */

export {};