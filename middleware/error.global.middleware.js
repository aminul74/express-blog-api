module.exports = (err, req, res, next) => {
  const errStatus = err.status || 500;
  let errMessage;

  console.log("from global err:", err);
  if (errStatus == 500) {
    errMessage = "Internal Server Error !!";
  } else {
    errMessage = err.message || "Unknown Error";
  }

  return res.status(errStatus).send(errMessage);
};
