const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

function BadRequestError(message) {
  this.statusCode = BAD_REQUEST;
  this.message = message;
}

function NotFoundError(message) {
  this.statusCode = NOT_FOUND;
  this.message = message;
}

function InternalServerError(message) {
  this.statusCode = INTERNAL_SERVER_ERROR;
  this.message = message;
}

module.exports = { BadRequestError, NotFoundError, InternalServerError };
