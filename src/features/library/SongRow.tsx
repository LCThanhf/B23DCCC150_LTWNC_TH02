import { memo } from 'react';
import type { CSSProperties } from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import { usePlayerStore } from '../player/usePlayerStore';

export interface SongRowProps {
  song: Song;
  index: number;
  style?: CSSProperties;
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
}

export const SongRow = memo(function SongRow({
  song,
  index,
  style,
  onPlay,
  onAddToQueue,
}: SongRowProps) {
  const isCurrent = usePlayerStore(
    (state) =>
      state.currentIndex >= 0 && state.queue[state.currentIndex]?.id === song.id,
  );

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
          aria-label={`Phát ${song.title}`}
          onClick={() => onPlay(song)}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" aria-hidden="true">
            <path d="M2 1.2v9.6L10.5 6 2 1.2Z" fill="currentColor" />
          </svg>
          <span className="btn-text">Phát</span>
        </button>

        <button
          type="button"
          className="icon-btn"
          aria-label={`Thêm ${song.title} vào hàng đợi`}
          title="Thêm vào hàng đợi"
          onClick={() => onAddToQueue(song)}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
            <path
              d="M2 4h8M2 8h8M2 12h5M13 6v6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M10.5 9.5 13 12l2.5-2.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>
      </div>
    </div>
  );
});
