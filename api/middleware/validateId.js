export default function validateId(key, source, message) {
  return (req, res, next) => {
    try {
      const value = Number(req[source][key]);

      if (isNaN(value)) {
        return res.status(400).send(message);
      }

      // set a custom key value pair on the req object
      req[key] = value;
      next();
    } catch (error) {
      next(error);
    }
  };
}
