import db from "#db/client";

export async function createPlaylist(name, description) {
  const sql = `
    INSERT INTO playlists(
      name,
      description
    )
    VALUES(
      $1,
      $2
    )
    RETURNING *;
  `;
  const { rows } = await db.query(sql, [name, description]);

  return rows[0];
}

export async function getPlaylists() {
  const sql = `
    SELECT * FROM playlists
  `;
  const { rows } = await db.query(sql);

  return rows;
}

export async function getPlaylistById(id) {
  const sql = `
    SELECT * FROM playlists
    WHERE id = $1;
  `;
  const { rows } = await db.query(sql, [id]);

  return rows[0];
}
