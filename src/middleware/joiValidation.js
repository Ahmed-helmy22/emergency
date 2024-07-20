const validation = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.json({ err: error.details });
    } else {
      next();
    }
  };
};

export default validation;
