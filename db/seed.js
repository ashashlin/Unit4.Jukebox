import { faker } from "@faker-js/faker";
import db from "#db/client";
import { createPlaylist } from "#db/queries/playlists";
import { createTrack } from "#db/queries/tracks";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // no need to check for duplicate playlist names - playlists can have the same name, as long as they have different ids
  for (let i = 0; i < 10; i++) {
    const name = faker.music.genre();
    const description = faker.lorem.paragraph({ min: 1, max: 3 });

    await createPlaylist(name, description);
  }

  // no need to check for duplicate track names - tracks can have the same name
  for (let i = 0; i < 20; i++) {
    const name = faker.music.songName();
    const durationMs = faker.number.int({ min: 60000, max: 300000 });

    await createTrack(name, durationMs);
  }

  // create 15 entries in the playlists_tracks table
  for (let i = 0; i < 15; i++) {
    const playlistId = Math.floor(Math.random() * 10) + 1;
    const trackId = Math.floor(Math.random() * 20) + 1;

    await createPlaylistTrack(playlistId, trackId);
  }
}
