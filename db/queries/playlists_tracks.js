import db from "#db/client";

export async function createPlaylistTrack(playlistId, trackId) {
  const sql = `
    INSERT INTO playlists_tracks(
      playlist_id,
      track_id
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;
  const { rows } = await db.query(sql, [playlistId, trackId]);

  return rows[0];
}

export async function getPlaylistTrackDetails(playlistId, trackId) {
  const sql = `
    SELECT
      playlists.name AS playlist,
      tracks.name AS track
    FROM
      playlists_tracks
    JOIN playlists
      ON playlists_tracks.playlist_id = playlists.id
    JOIN tracks
      ON playlists_tracks.track_id = tracks.id
    WHERE
      playlists_tracks.playlist_id = $1
      AND
      playlists_tracks.track_id = $2
      ;
  `;
  const { rows } = await db.query(sql, [playlistId, trackId]);

  return rows[0];
}
