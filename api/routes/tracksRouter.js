import express from "express";
import { getTrackById, getTracks } from "#db/queries/tracks";

const tracksRouter = express.Router();

tracksRouter.get("/", async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.status(200).send(tracks);
  } catch (error) {
    next(error);
  }
});

tracksRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).send(`Error: track ID must be a number.`);
    }

    const track = await getTrackById(id);

    if (!track) {
      return res.status(404).send(`Error: track with id ${id} does not exist.`);
    }

    res.status(200).send(track);
  } catch (error) {
    next(error);
  }
});

export default tracksRouter;
