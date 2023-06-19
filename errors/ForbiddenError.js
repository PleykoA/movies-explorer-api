class ForbiddenError extends Error {
  constructor(message) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
