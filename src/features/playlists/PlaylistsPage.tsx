export default function PlaylistsPage() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Bộ sưu tập</p>
          <h1 className="page-title">Playlist của bạn</h1>
        </div>
      </header>
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">
          ≡
        </span>
        <strong>Chưa có playlist nào</strong>
      </div>
    </div>
  );
}
