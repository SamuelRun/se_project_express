const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INTERNAL_SERVER_ERROR;
  }
}

module.exports = { BadRequestError, NotFoundError, InternalServerError };
