module.exports = (err, req, res, next) => {
  const errStatus = err.status || 500;
  let errMessage;

  if (errStatus == 500) {
    errMessage = "Internal Server Error";
  } else {
    errMessage = err.message || "Unknown Error";
  }

  res.status(errStatus).send(errMessage);
};
