import { describe, expect, it } from 'vitest';
import { playlistReducer } from './playlistReducer';
import type { Playlist } from './playlistReducer';

const initialState: Playlist[] = [
  { id: 'p1', name: 'Chạy bộ', songIds: ['s1'] },
];

describe('playlistReducer', () => {
  it('tạo playlist mới và trim tên', () => {
    const next = playlistReducer(initialState, {
      type: 'create',
      payload: { id: 'p2', name: '  Buổi sáng  ' },
    });

    expect(next).toHaveLength(2);
    expect(next[1]).toEqual({ id: 'p2', name: 'Buổi sáng', songIds: [] });
    expect(initialState).toHaveLength(1);
  });

  it('addSong không thêm trùng bài hát', () => {
    const once = playlistReducer(initialState, {
      type: 'addSong',
      payload: { playlistId: 'p1', songId: 's2' },
    });
    const twice = playlistReducer(once, {
      type: 'addSong',
      payload: { playlistId: 'p1', songId: 's2' },
    });

    expect(once[0].songIds).toEqual(['s1', 's2']);
    expect(twice[0].songIds).toEqual(['s1', 's2']);
  });

  it('removeSong bỏ đúng bài khỏi playlist', () => {
    const next = playlistReducer(initialState, {
      type: 'removeSong',
      payload: { playlistId: 'p1', songId: 's1' },
    });

    expect(next[0].songIds).toEqual([]);
  });

  it('xóa playlist không tồn tại thì giữ nguyên state', () => {
    const next = playlistReducer(initialState, {
      type: 'remove',
      payload: { id: 'không-tồn-tại' },
    });

    expect(next).toEqual(initialState);
  });

  it('rename đổi tên playlist theo id', () => {
    const next = playlistReducer(initialState, {
      type: 'rename',
      payload: { id: 'p1', name: 'Chạy bộ tối' },
    });

    expect(next[0].name).toBe('Chạy bộ tối');
    expect(next[0].songIds).toEqual(['s1']);
  });

  it('bỏ bài hát không có trong playlist thì không thay đổi nội dung', () => {
    const next = playlistReducer(initialState, {
      type: 'removeSong',
      payload: { playlistId: 'p1', songId: 's9' },
    });

    expect(next).toEqual(initialState);
  });
});
