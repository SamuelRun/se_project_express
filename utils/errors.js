const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const INTERNAL_SERVER_ERROR = 500;

function BadRequestError(message) {
  this.statusCode = BAD_REQUEST;
  this.message = message;
}

BadRequestError.statusCode = BAD_REQUEST;

function UnauthorizedError(message) {
  this.statusCode = UNAUTHORIZED;
  this.message = message;
}

UnauthorizedError.statusCode = UNAUTHORIZED;

function ForbiddenError(message) {
  this.statusCode = FORBIDDEN;
  this.message = message;
}

ForbiddenError.statusCode = FORBIDDEN;

function NotFoundError(message) {
  this.statusCode = NOT_FOUND;
  this.message = message;
}

NotFoundError.statusCode = NOT_FOUND;

function ConflictError(message) {
  this.statusCode = CONFLICT;
  this.message = message;
}

ConflictError.statusCode = CONFLICT;

function InternalServerError(message) {
  this.statusCode = INTERNAL_SERVER_ERROR;
  this.message = message;
}

InternalServerError.statusCode = INTERNAL_SERVER_ERROR;

module.exports = {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError,
  ConflictError,
  ForbiddenError,
};
