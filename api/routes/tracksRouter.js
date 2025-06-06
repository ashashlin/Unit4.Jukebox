import express from "express";
import { getTrackById, getTracks } from "#db/queries/tracks";
import validateId from "#api/middleware/validateId";
import validateDataExistence from "#api/middleware/validateDataExistence";

const tracksRouter = express.Router();

tracksRouter.get("/", async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.status(200).send(tracks);
  } catch (error) {
    next(error);
  }
});

tracksRouter.get(
  "/:id",
  validateId("id", "params", "Error: track ID must be a number."),
  validateDataExistence(getTrackById, 404, "track"),
  async (req, res, next) => {
    try {
      // set the custom key value pair on the req object in the middleware, so we can directly access it here
      const id = req.id;

      const { track } = req;
      res.status(200).send(track);
    } catch (error) {
      next(error);
    }
  }
);

export default tracksRouter;
