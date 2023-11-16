const validation = (schema) => async (req, res, next) => {
  const body = req.body;

  try {
    await schema.validate(body);
    //   here
    next();
  } catch (error) {
    const errorMessage = error.errors[0] || "Validation failed";

    return res.status(400).json({ error: errorMessage });
  }
};

module.exports = validation;
