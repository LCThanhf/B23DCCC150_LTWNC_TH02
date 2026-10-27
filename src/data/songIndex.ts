import { SONGS } from './songs';

export const SONG_BY_ID = new Map(SONGS.map((song) => [song.id, song]));
