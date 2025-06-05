import express from "express";
import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";

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

// playlistsRouter.get("/:id/tracks", async (req, res, next) => {
//   try {
//   } catch (error) {
//     next(error);
//   }
// });

export default playlistsRouter;
