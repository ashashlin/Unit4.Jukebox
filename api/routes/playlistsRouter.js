import express from "express";
import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { getTracksByPlaylistId, getTrackById } from "#db/queries/tracks";
import {
  createPlaylistTrack,
  getPlaylistTrackDetails,
} from "#db/queries/playlists_tracks";

const playlistsRouter = express.Router();

playlistsRouter.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylists();
    res.status(200).send(playlists);
  } catch (error) {
    next(error);
  }
});

playlistsRouter.post("/", async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send(
          "Error: no request body provided. Please provide a request body with your request."
        );
    }

    const { name, description } = req.body;

    if (!name || !description) {
      return res
        .status(400)
        .send(
          "Error: request body is missing one or more fields. Please provide name, description of a playlist."
        );
    }

    // need to always send a res to avoid the request hanging. we can choose to include a body or not
    await createPlaylist(name, description);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
});

playlistsRouter.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).send(`Error: playlist ID must be a number.`);
    }

    const playlist = await getPlaylistById(id);

    if (!playlist) {
      return res
        .status(404)
        .send(`Error: playlist with id ${id} does not exist.`);
    }

    res.status(200).send(playlist);
  } catch (error) {
    next(error);
  }
});

playlistsRouter.get("/:id/tracks", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).send(`Error: playlist ID must be a number.`);
    }

    // check if playlist with this id exists first
    const playlist = await getPlaylistById(id);

    if (!playlist) {
      return res
        .status(404)
        .send(`Error: playlist with id ${id} does not exist.`);
    }

    // now check the tracks in the specified playlist
    const tracks = await getTracksByPlaylistId(id);

    if (tracks.length === 0) {
      return res.status(200).send("No tracks in this playlist.");
    }

    res.status(200).send(tracks);
  } catch (error) {
    next(error);
  }
});

playlistsRouter.post("/:id/tracks", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).send(`Error: playlist ID must be a number.`);
    }

    // check if playlist with this id exists first
    const playlist = await getPlaylistById(id);

    if (!playlist) {
      return res
        .status(404)
        .send(`Error: playlist with id ${id} does not exist.`);
    }

    // now check if a request body is included
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .send(
          "Error: no request body provided. Please provide a request body with your request."
        );
    }

    const trackId = Number(req.body.trackId);

    if (isNaN(trackId)) {
      return res
        .status(400)
        .send(`Error: request body must include a trackId that's a number.`);
    }

    const track = await getTrackById(trackId);

    if (!track) {
      return res
        .status(404)
        .send(`Error: track with id ${trackId} does not exist.`);
    }

    // create playlist-track entry in the junction table
    await createPlaylistTrack(id, trackId);

    const playlistTrack = await getPlaylistTrackDetails(id, trackId);
    res.status(201).send(playlistTrack);
  } catch (error) {
    next(error);
  }
});

export default playlistsRouter;
