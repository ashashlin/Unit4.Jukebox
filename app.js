import express from "express";
import playlistsRouter from "#api/routes/playlistsRouter";
import tracksRouter from "#api/routes/tracksRouter";

const app = express();

app.use(express.json());

app.use("/playlists", playlistsRouter);
app.use("/tracks", tracksRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});

export default app;
