import { useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { SONG_BY_ID } from '../../data/songIndex';
import type { Song } from '../../types';
import { SongRow } from '../library/SongRow';
import { usePlayerStore } from '../player/usePlayerStore';
import { usePlaylistDispatch, usePlaylists } from './PlaylistContext';

export default function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((state) => state.playQueue);
  const addToQueue = usePlayerStore((state) => state.addToQueue);

  const playlist = playlists.find((item) => item.id === id);

  const songs = useMemo<Song[]>(() => {
    if (!playlist) return [];

    return playlist.songIds
      .map((songId) => SONG_BY_ID.get(songId))
      .filter((song): song is Song => song !== undefined);
  }, [playlist]);

  const totalSeconds = useMemo(
    () => songs.reduce((total, song) => total + song.duration, 0),
    [songs],
  );

  const handlePlay = useCallback(
    (song: Song) => {
      const startIndex = songs.findIndex((item) => item.id === song.id);
      playQueue(songs, startIndex < 0 ? 0 : startIndex);
    },
    [songs, playQueue],
  );

  const handlePlayAll = useCallback(() => {
    if (songs.length > 0) playQueue(songs, 0);
  }, [songs, playQueue]);

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song);
    },
    [addToQueue],
  );

  const handleRemove = useCallback(
    (song: Song) => {
      if (!playlist) return;
      dispatch({
        type: 'removeSong',
        payload: { playlistId: playlist.id, songId: song.id },
      });
    },
    [dispatch, playlist],
  );

  if (!playlist) {
    return (
      <div className="page">
        <Link className="back-link" to="/playlists">
          ← Tất cả playlist
        </Link>
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            ?
          </span>
          <strong>Không tìm thấy playlist</strong>
          <span>Playlist có thể đã bị xóa hoặc đường dẫn không đúng.</span>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return (
    <div className="page">
      <Link className="back-link" to="/playlists">
        ← Tất cả playlist
      </Link>

      <header className="detail-head">
        <div>
          <div className="detail-cover" aria-hidden="true">
            ♫
          </div>
          <p className="eyebrow">Playlist</p>
          <h1 className="page-title">{playlist.name}</h1>
          <div className="detail-stats">
            <span>
              <strong>{songs.length}</strong> bài hát
            </span>
            <span className="total-duration">
              Tổng thời lượng: {minutes} phút {seconds} giây
            </span>
          </div>
        </div>

        <div className="page-actions">
          <button
            type="button"
            className="btn btn-accent btn-lg"
            onClick={handlePlayAll}
            disabled={songs.length === 0}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 1.2v9.6L10.5 6 2 1.2Z" fill="currentColor" />
            </svg>
            Phát tất cả
          </button>
        </div>
      </header>

      {songs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            ♪
          </span>
          <strong>Playlist chưa có bài hát nào</strong>
          <span>Vào Thư viện, chọn playlist này và bấm + Playlist ở mỗi bài.</span>
        </div>
      ) : (
        <div className="static-list">
          {songs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              onPlay={handlePlay}
              onAddToQueue={handleAddToQueue}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
