export default function validateReqBody(req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send(
          "Error: no request body provided. Please provide a request body with your request."
        );
    }

    next();
  } catch (error) {
    next(error);
  }
}
