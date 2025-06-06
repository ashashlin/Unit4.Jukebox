import express from "express";
import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { getTracksByPlaylistId, getTrackById } from "#db/queries/tracks";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import validateId from "#api/middleware/validateId";
import validateDataExistence from "#api/middleware/validateDataExistence";
import validateReqBody from "#api/middleware/validateReqBody";

const playlistsRouter = express.Router();

playlistsRouter.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylists();
    res.status(200).send(playlists);
  } catch (error) {
    next(error);
  }
});

playlistsRouter.post("/", validateReqBody, async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .send(
          "Error: request body is missing one or more fields. Please provide name, description of a playlist."
        );
    }

    const newPlaylist = await createPlaylist(name, description);
    res.status(201).send(newPlaylist);
  } catch (error) {
    next(error);
  }
});

playlistsRouter.get(
  "/:id",
  validateId("id", "params", "Error: playlist ID must be a number."),
  validateDataExistence(getPlaylistById, 404, "playlist"),
  async (req, res, next) => {
    try {
      const id = req.id;

      const { playlist } = req;
      res.status(200).send(playlist);
    } catch (error) {
      next(error);
    }
  }
);

playlistsRouter.get(
  "/:id/tracks",
  validateId("id", "params", "Error: playlist ID must be a number."),
  validateDataExistence(getPlaylistById, 404, "playlist"),
  async (req, res, next) => {
    try {
      const id = req.id;

      // now check the tracks in the specified playlist
      const tracks = await getTracksByPlaylistId(id);

      if (tracks.length === 0) {
        return res.status(200).send("No tracks in this playlist.");
      }

      res.status(200).send(tracks);
    } catch (error) {
      next(error);
    }
  }
);

playlistsRouter.post(
  "/:id/tracks",
  validateId("id", "params", "Error: playlist ID must be a number."),
  validateDataExistence(getPlaylistById, 404, "playlist"),
  validateReqBody,
  validateId(
    "trackId",
    "body",
    "Error: request body must include a trackId that's a number."
  ),
  validateDataExistence(getTrackById, 400, "track", "trackId"),
  async (req, res, next) => {
    try {
      const id = req.id;

      const { trackId } = req;

      // create playlist-track entry in the junction table
      const playlistTrack = await createPlaylistTrack(id, trackId);
      res.status(201).send(playlistTrack);
    } catch (error) {
      next(error);
    }
  }
);

export default playlistsRouter;
