
module.exports = (err, req, res, next) => {
    const errStatus = err.status || 500;
    let errMessage ;
    if (errStatus == 500 ) {
        errMessage = "Internal Servar Error"
    }else{
        errMessage = err.message;
    }
    res.status(errStatus).send(errMessage);
  }