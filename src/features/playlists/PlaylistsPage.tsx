import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylistDispatch, usePlaylists } from './PlaylistContext';

let playlistSequence = 0;

const createPlaylistId = (): string => {
  playlistSequence += 1;
  return `pl-${Date.now()}-${playlistSequence}`;
};

interface PlaylistFormProps {
  existingNames: string[];
}

function PlaylistForm({ existingNames }: PlaylistFormProps) {
  const dispatch = usePlaylistDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Tên playlist không được để trống');
      return;
    }

    const duplicated = existingNames.some(
      (existing) => existing.toLowerCase() === trimmed.toLowerCase(),
    );

    if (duplicated) {
      setError('Tên playlist đã tồn tại');
      return;
    }

    dispatch({ type: 'create', payload: { id: createPlaylistId(), name: trimmed } });
    setName('');
    setError(null);
  };

  return (
    <form className="playlist-form" onSubmit={handleSubmit} noValidate>
      <label className="field-label" htmlFor="playlist-name">
        Tên playlist
      </label>
      <div className="inline-form">
        <input
          id="playlist-name"
          className="input"
          type="text"
          placeholder="VD: Chạy bộ buổi sáng"
          value={name}
          autoComplete="off"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'playlist-form-error' : undefined}
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError(null);
          }}
        />
        <button type="submit" className="btn btn-accent">
          Tạo
        </button>
      </div>
      {error && (
        <p id="playlist-form-error" className="form-error" role="alert">
          <span aria-hidden="true">!</span>
          {error}
        </p>
      )}
      <p className="form-hint">Tên playlist không phân biệt hoa thường khi kiểm tra trùng.</p>
    </form>
  );
}

export default function PlaylistsPage() {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Bộ sưu tập</p>
          <h1 className="page-title">Playlist của bạn</h1>
          <p className="page-sub">
            Gom những bài hát hợp gu thành từng playlist. Mọi thay đổi được lưu
            lại trên trình duyệt.
          </p>
        </div>
        <span className="stat-card">
          <span className="stat-value">{playlists.length}</span>
          <span className="stat-label">playlist</span>
        </span>
      </header>

      <div className="playlist-layout">
        <section className="panel" aria-label="Tạo playlist">
          <h2 className="panel-title">Playlist mới</h2>
          <p className="panel-sub">
            Đặt tên dễ nhớ, sau đó thêm bài hát từ trang Thư viện.
          </p>
          <PlaylistForm existingNames={playlists.map((playlist) => playlist.name)} />
        </section>

        <section aria-label="Danh sách playlist">
          {playlists.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" aria-hidden="true">
                ≡
              </span>
              <strong>Chưa có playlist nào</strong>
              <span>Tạo playlist đầu tiên ở khung bên cạnh.</span>
            </div>
          ) : (
            <div className="playlist-grid">
              {playlists.map((playlist) => (
                <article className="playlist-card" key={playlist.id}>
                  <span className="playlist-cover" aria-hidden="true">
                    ♫
                  </span>
                  <Link className="playlist-link" to={`/playlists/${playlist.id}`}>
                    <span className="playlist-name">{playlist.name}</span>
                    <span className="playlist-meta">{playlist.songIds.length} bài</span>
                  </Link>
                  <div className="playlist-card-foot">
                    <Link className="text-link" to={`/playlists/${playlist.id}`}>
                      Mở playlist →
                    </Link>
                    <button
                      type="button"
                      className="btn btn-ghost btn-danger"
                      aria-label={`Xóa playlist ${playlist.name}`}
                      onClick={() =>
                        dispatch({ type: 'remove', payload: { id: playlist.id } })
                      }
                    >
                      Xóa
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
