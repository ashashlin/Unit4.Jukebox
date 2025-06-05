DROP TABLE IF EXISTS playlists CASCADE;
DROP TABLE IF EXISTS tracks;
DROP TABLE IF EXISTS playlists_tracks;

CREATE TABLE playlists(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE tracks(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  duration_ms INT NOT NULL
);

CREATE TABLE playlists_tracks(
  id SERIAL PRIMARY KEY,
  playlist_id INT NOT NULL
    REFERENCES playlists(id)
    ON DELETE CASCADE,
  track_id INT NOT NULL
    REFERENCES tracks(id)
    ON DELETE CASCADE,
  UNIQUE(track_id, playlist_id)
);
