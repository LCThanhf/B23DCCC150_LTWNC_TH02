export default function FavoritesPage() {
  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Bộ sưu tập</p>
          <h1 className="page-title">Bài hát yêu thích</h1>
          <p className="page-sub">Những bài hát bạn đã đánh dấu yêu thích.</p>
        </div>
      </header>
      <div className="empty-state">
        <span className="empty-icon" aria-hidden="true">
          ♡
        </span>
        <strong>Bạn chưa có bài hát yêu thích</strong>
      </div>
    </div>
  );
}
