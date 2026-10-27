import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';

export interface SongRowProps {
  song: Song;
  index: number;
  style?: CSSProperties;
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  onAddToPlaylist?: (song: Song) => void;
  playlistDisabled?: boolean;
  onRemove?: (song: Song) => void;
}

export const SongRow = memo(function SongRow({
  song,
  index,
  style,
  onPlay,
  onAddToQueue,
  onAddToPlaylist,
  playlistDisabled = false,
  onRemove,
}: SongRowProps) {
  const isCurrent = usePlayerStore(
    (state) =>
      state.currentIndex >= 0 && state.queue[state.currentIndex]?.id === song.id,
  );
  const isFavorite = useFavoritesStore((state) => state.ids.includes(song.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggle);

  return (
    <div
      className={`song-row${isCurrent ? ' is-current' : ''}`}
      style={style}
      data-song-id={song.id}
    >
      <span className="song-index">{String(index + 1).padStart(2, '0')}</span>

      <div className="song-main">
        <span className="song-title">{song.title}</span>
        <span className="song-artist">{song.artist}</span>
      </div>

      <span className={`genre-tag genre-${song.genre.toLowerCase()}`}>
        {song.genre}
      </span>

      <span className="song-duration">{formatDuration(song.duration)}</span>

      <div className="song-actions">
        <button
          type="button"
          className="btn btn-play"
          title={`Phát ${song.title}`}
          onClick={() => onPlay(song)}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 1.2v9.6L10.5 6 2 1.2Z" fill="currentColor" />
          </svg>
          <span className="btn-text">Phát</span>
        </button>

        <button
          type="button"
          className={`icon-btn heart${isFavorite ? ' is-active' : ''}`}
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          aria-pressed={isFavorite}
          title={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          onClick={() => toggleFavorite(song.id)}
        >
          {isFavorite ? '♥' : '♡'}
        </button>

        <button
          type="button"
          className="btn btn-queue"
          title={`Thêm ${song.title} vào hàng đợi`}
          onClick={() => onAddToQueue(song)}
        >
          <span>+</span>{' '}
          <span className="btn-text">Hàng đợi</span>
        </button>

        {onAddToPlaylist && (
          <button
            type="button"
            className="btn btn-playlist"
            title={playlistDisabled ? 'Chọn playlist trước' : 'Thêm vào playlist'}
            disabled={playlistDisabled}
            onClick={() => onAddToPlaylist(song)}
          >
            <span>+</span>{' '}
            <span className="btn-text">Playlist</span>
          </button>
        )}

        {onRemove && (
          <button
            type="button"
            className="btn btn-ghost btn-danger"
            title={`Bỏ ${song.title} khỏi playlist`}
            onClick={() => onRemove(song)}
          >
            Bỏ
          </button>
        )}
      </div>
    </div>
  );
});
