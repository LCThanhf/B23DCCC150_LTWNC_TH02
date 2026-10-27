import { useCallback, useMemo } from 'react';
import { SONG_BY_ID } from '../../data/songIndex';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import { SongRow } from '../library/SongRow';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from './useFavoritesStore';

export default function FavoritesPage() {
  const ids = useFavoritesStore((state) => state.ids);
  const playQueue = usePlayerStore((state) => state.playQueue);
  const addToQueue = usePlayerStore((state) => state.addToQueue);

  const songs = useMemo<Song[]>(
    () =>
      ids
        .map((id) => SONG_BY_ID.get(id))
        .filter((song): song is Song => song !== undefined),
    [ids],
  );

  const totalDuration = useMemo(
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

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song);
    },
    [addToQueue],
  );

  const handlePlayAll = useCallback(() => {
    if (songs.length > 0) playQueue(songs, 0);
  }, [songs, playQueue]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Bộ sưu tập</p>
          <h1 className="page-title">Bài hát yêu thích</h1>
          <p className="page-sub">
            Danh sách được ghi nhớ trên trình duyệt. Bấm ♥ ở bất kỳ bài nào để
            thêm hoặc gỡ khỏi bộ sưu tập.
          </p>
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

      {songs.length > 0 && (
        <div className="favorites-summary">
          <span className="stat-card">
            <span className="stat-value">{songs.length}</span>
            <span className="stat-label">bài hát</span>
          </span>
          <span className="stat-card">
            <span className="stat-value">{formatDuration(totalDuration)}</span>
            <span className="stat-label">tổng thời lượng</span>
          </span>
        </div>
      )}

      {songs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            ♡
          </span>
          <strong>Bạn chưa có bài hát yêu thích</strong>
          <span>Hãy quay lại thư viện và bấm vào biểu tượng trái tim.</span>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
