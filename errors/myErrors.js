class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
  }
}

class ValidationError extends CustomError {
  constructor(message = 'Validation Failed') {
    super(message, 400);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  ValidationError,
};
