import { formatDuration } from '../../utils/format';
import { usePlayerStore } from './usePlayerStore';

export function ProgressBar() {
  const position = usePlayerStore((state) => state.position);
  const duration = usePlayerStore((state) =>
    state.currentIndex >= 0 ? state.queue[state.currentIndex]?.duration ?? 0 : 0,
  );

  const percent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <div className="progress">
      <span className="progress-time" data-testid="progress-time">
        {formatDuration(position)} / {formatDuration(duration)}
      </span>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Tiến trình phát"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={position}
        aria-valuetext={`${formatDuration(position)} trên ${formatDuration(duration)}`}
      >
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
