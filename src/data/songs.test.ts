import { describe, expect, it } from 'vitest';
import { generateSongs } from './songs';

describe('generateSongs', () => {
  it('sinh đúng 10.000 bài hát', () => {
    expect(generateSongs(10000)).toHaveLength(10000);
  });

  it('không trùng id giữa các bài hát', () => {
    const songs = generateSongs(10000);
    const uniqueIds = new Set(songs.map((song) => song.id));

    expect(uniqueIds.size).toBe(10000);
  });

  it('mọi thời lượng nằm trong khoảng 150 đến 300 giây', () => {
    const songs = generateSongs(10000);

    expect(
      songs.every((song) => song.duration >= 150 && song.duration <= 300),
    ).toBe(true);
  });
});
