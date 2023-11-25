const UnauthorizedError = () => {
  const error = new Error("Unauthorized!");
  error.status = 404;
  throw error;
};

module.exports = { UnauthorizedError };