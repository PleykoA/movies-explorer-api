class AuthorizationError extends Error {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = 401;
  }
}

module.exports = AuthorizationError;
