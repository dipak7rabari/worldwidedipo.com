const SAFE_ERROR_MAP = Object.freeze({
  '23505': {
    code: 'CONFLICT',
    message: 'This value is already in use.',
    status: 409,
  },

  '23503': {
    code: 'INVALID_REFERENCE',
    message: 'The referenced record does not exist.',
    status: 400,
  },

  '23514': {
    code: 'VALIDATION_FAILED',
    message: 'The submitted data failed a database validation rule.',
    status: 400,
  },

  '42501': {
    code: 'FORBIDDEN',
    message: 'You do not have permission to perform this action.',
    status: 403,
  },
});

export function normalizeSupabaseError(error) {
  if (!error) {
    return null;
  }

  const mapped = SAFE_ERROR_MAP[error.code];

  if (mapped) {
    return {
      ...mapped,
      cause: error,
    };
  }

  return {
    code: 'DATABASE_ERROR',
    message: 'The request could not be completed.',
    status: 500,
    cause: error,
  };
}

export function isUniqueViolation(error) {
  return error?.code === '23505';
}

export function isPermissionError(error) {
  return error?.code === '42501';
}