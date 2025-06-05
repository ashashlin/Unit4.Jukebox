import db from "#db/client";

export async function createTrack(name, durationMs) {
  const sql = `
    INSERT INTO tracks(
      name,
      duration_ms
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;
  const { rows } = await db.query(sql, [name, durationMs]);

  return rows[0];
}

export async function getTracks() {
  const sql = `
    SELECT * FROM tracks
  `;
  const { rows } = await db.query(sql);

  return rows;
}

export async function getTrackById(id) {
  const sql = `
    SELECT * FROM tracks
    WHERE id = $1;
  `;
  const { rows } = await db.query(sql, [id]);

  return rows[0];
}

export async function getTracksByPlaylistId(id) {
  const sql = `
    SELECT
      tracks.name
    FROM
      playlists_tracks
    JOIN tracks
        ON playlists_tracks.track_id = tracks.id
    WHERE
      playlists_tracks.playlist_id = $1;
  `;
  const { rows } = await db.query(sql, [id]);

  return rows;
}
