/**
 * @typedef {Object} ApiSuccess
 * @property {true} success
 * @property {*} data
 */

/**
 * @typedef {Object} ApiError
 * @property {false} success
 * @property {string} error
 * @property {string} code
 */

/**
 * @typedef {ApiSuccess|ApiError} ApiResponse
 */

/**
 * @typedef {Object} Pagination
 * @property {number} page
 * @property {number} pageSize
 * @property {number} total
 * @property {boolean} hasMore
 */

export {};