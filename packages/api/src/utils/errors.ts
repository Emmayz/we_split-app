export class AppError extends Error {
  code: string;
  statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, "NOT_FOUND", 404);
  }
}

export class UnauthorisedError extends AppError {
  constructor(message = "Unauthorised") {
    super(message, "UNAUTHORISED", 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, "FORBIDDEN", 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation failed") {
    super(message, "VALIDATION_ERROR", 400);
  }
}

export class PaymentError extends AppError {
  constructor(message = "Payment failed") {
    super(message, "PAYMENT_ERROR", 402);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, "CONFLICT", 409);
  }
}

export class ExpiredTokenError extends AppError {
  constructor(message = "Token expired or already used") {
    super(message, "EXPIRED_TOKEN", 410);
  }
}
