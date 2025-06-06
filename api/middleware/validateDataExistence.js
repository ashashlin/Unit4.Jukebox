export default function validateDataExistence(
  getDataFunc,
  statusCode,
  data,
  key = "id"
) {
  return async (req, res, next) => {
    try {
      const id = req[key];

      const dataEntry = await getDataFunc(id);

      if (!dataEntry) {
        return res
          .status(statusCode)
          .send(`Error: ${data} with id ${id} does not exist.`);
      }

      req[data] = dataEntry;
      next();
    } catch (error) {
      next(error);
    }
  };
}
