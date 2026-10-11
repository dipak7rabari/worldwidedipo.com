/**
 * @typedef {"starter"|"pro"|"elite"} PlanId
 */

/**
 * @typedef {Object} Plan
 * @property {PlanId} id
 * @property {string} name
 * @property {number} price
 * @property {number} durationMonths
 * @property {number} imageLimit
 * @property {string[]} features
 * @property {string} description
 */

/**
 * @typedef {"draft"|"pending"|"active"|"expired"} ProfileStatus
 */

/**
 * @typedef {"initial"|"renewal"} PaymentType
 */

/**
 * @typedef {"pending"|"verified"|"rejected"} PaymentStatus
 */

export {};