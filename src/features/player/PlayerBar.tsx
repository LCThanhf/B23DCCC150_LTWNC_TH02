import { useEffect } from 'react';
import { usePlayerStore } from './usePlayerStore';
import { ProgressBar } from './ProgressBar';

export function PlayerBar() {
  const currentSong = usePlayerStore((state) =>
    state.currentIndex >= 0 ? state.queue[state.currentIndex] : undefined,
  );
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const queueLength = usePlayerStore((state) => state.queue.length);
  const togglePlay = usePlayerStore((state) => state.togglePlay);
  const next = usePlayerStore((state) => state.next);
  const prev = usePlayerStore((state) => state.prev);

  useEffect(() => {
    if (!isPlaying) return;

    const timer = window.setInterval(() => {
      usePlayerStore.getState().tick();
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPlaying]);

  const hasSong = Boolean(currentSong);

  return (
    <section className="player-bar" aria-label="Thanh phát nhạc">
      <div className="now-playing">
        <div
          className={`now-disc${isPlaying ? ' is-spinning' : ''}`}
          aria-hidden="true"
        />
        <div className="now-meta">
          <p className="now-label">Now playing</p>
          <p className="now-title">
            {currentSong
              ? `Đang phát: ${currentSong.title} – ${currentSong.artist}`
              : 'Chưa phát bài nào'}
          </p>
          <p className="now-artist">
            {currentSong ? currentSong.genre : 'Chọn một bài hát để bắt đầu'}
          </p>
        </div>
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button
            type="button"
            className="control-btn"
            aria-label="Trước"
            title="Trước"
            disabled={!hasSong}
            onClick={prev}
          >
            <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M4.5 3.5v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M14 4.4v9.2L7 9l7-4.6Z" fill="currentColor" />
            </svg>
          </button>

          <button
            type="button"
            className="control-btn control-main"
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            title={isPlaying ? 'Tạm dừng' : 'Phát'}
            disabled={!hasSong}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
                <rect x="3.4" y="2.6" width="3.3" height="10.8" rx="1" fill="currentColor" />
                <rect x="9.3" y="2.6" width="3.3" height="10.8" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M4 2.4v11.2L13 8 4 2.4Z" fill="currentColor" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="control-btn"
            aria-label="Sau"
            title="Sau"
            disabled={!hasSong}
            onClick={next}
          >
            <svg width="17" height="17" viewBox="0 0 18 18" aria-hidden="true">
              <path d="M13.5 3.5v11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M4 4.4v9.2L11 9 4 4.4Z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <ProgressBar />
      </div>

      <div className="queue-info">
        <span className="queue-count">Hàng đợi: {queueLength} bài</span>
        <span className="queue-hint">{isPlaying ? 'Đang phát' : 'Sẵn sàng'}</span>
      </div>
    </section>
  );
}
