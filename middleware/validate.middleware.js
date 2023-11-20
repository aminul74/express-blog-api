const validation = (schema) => async (req, res, next) => {
  const userBody = req.body;
  try {
    await schema.validate(userBody);
    return next();
  } catch (error) {
    const errorMessage = error.errors[0] || "Validation failed";

    return res.status(400).json({ error: errorMessage });
  }
};

module.exports = validation;
