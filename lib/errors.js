export class DipoError extends Error {
  constructor(
    message,
    code = "DIPO_ERROR",
    status = 400,
    details = null
  ) {
    super(message);

    this.name = "DipoError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class ValidationError extends DipoError {
  constructor(message, details = null) {
    super(
      message,
      "VALIDATION_ERROR",
      400,
      details
    );

    this.name = "ValidationError";
  }
}

export class AuthenticationError extends DipoError {
  constructor(message = "Authentication required.") {
    super(
      message,
      "AUTHENTICATION_REQUIRED",
      401
    );

    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends DipoError {
  constructor(message = "You are not authorized to perform this action.") {
    super(
      message,
      "FORBIDDEN",
      403
    );

    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends DipoError {
  constructor(message = "The requested resource was not found.") {
    super(
      message,
      "NOT_FOUND",
      404
    );

    this.name = "NotFoundError";
  }
}

export class ConflictError extends DipoError {
  constructor(message, details = null) {
    super(
      message,
      "CONFLICT",
      409,
      details
    );

    this.name = "ConflictError";
  }
}

export function isDipoError(error) {
  return error instanceof DipoError;
}

export function toApiError(error) {
  if (isDipoError(error)) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }

  return {
    success: false,
    error: "An unexpected server error occurred.",
    code: "INTERNAL_SERVER_ERROR"
  };
}