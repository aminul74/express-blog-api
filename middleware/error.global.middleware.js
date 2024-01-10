const { getContentBasedOnNegotiation } = require("../utils/responseType");

module.exports = async (err, req, res, next) => {
  const errStatus = err.status || 500;
  let errMessage;

  if (errStatus == 500) {
    errMessage = "Internal Server Error !!";
  } else {
    errMessage = err.message || "Unknown Error";
  }

  const negotiate = req.accepts(["json", "text", "xml", "html"]);
  res.type(negotiate);

  const response = await getContentBasedOnNegotiation(
    [{ errMessage }],
    negotiate
  );
  return res.status(errStatus).send(response);
};
