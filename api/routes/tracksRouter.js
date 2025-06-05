import { getTracks } from "#db/queries/tracks";
import express from "express";

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

    const tracks = await getTracks();
    const track = tracks.find((track) => track.id === id);

    if (!track) {
      return res.status(404).send(`Track with id ${id} does not exist.`);
    }

    res.status(200).send(track);
  } catch (error) {
    next(error);
  }
});

export default tracksRouter;
