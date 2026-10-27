import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { GENRES, SONGS } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import type { Genre, Song } from '../../types';
import { usePlayerStore } from '../player/usePlayerStore';
import { VirtualSongList } from './VirtualSongList';

type GenreFilter = Genre | 'All';
type SortKey = 'default' | 'title' | 'duration';

const SORT_LABELS: Record<SortKey, string> = {
  default: 'Mặc định',
  title: 'Tên A–Z',
  duration: 'Thời lượng tăng dần',
};

export default function LibraryPage() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState<GenreFilter>('All');
  const [sort, setSort] = useState<SortKey>('default');

  const debouncedQuery = useDebounce(query, 300);
  const playQueue = usePlayerStore((state) => state.playQueue);
  const addToQueue = usePlayerStore((state) => state.addToQueue);

  const filteredSongs = useMemo<Song[]>(() => {
    const keyword = debouncedQuery.trim().toLowerCase();

    let result = SONGS;

    if (keyword) {
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(keyword) ||
          song.artist.toLowerCase().includes(keyword),
      );
    }

    if (genre !== 'All') {
      result = result.filter((song) => song.genre === genre);
    }

    if (sort === 'title') {
      return [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    }

    if (sort === 'duration') {
      return [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedQuery, genre, sort]);

  const handleQueryShift = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const handleGenreChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setGenre(event.target.value as GenreFilter);
  }, []);

  const handleSortChange = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSort(event.target.value as SortKey);
  }, []);

  const handlePlay = useCallback(
    (song: Song) => {
      const startIndex = filteredSongs.findIndex((item) => item.id === song.id);
      playQueue(filteredSongs, startIndex < 0 ? 0 : startIndex);
    },
    [filteredSongs, playQueue],
  );

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song);
    },
    [addToQueue],
  );

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <p className="eyebrow">Thư viện</p>
          <h1 className="page-title">Tất cả bài hát</h1>
          <p className="page-sub">
            Một thư viện 10.000 bài hát được ảo hóa để luôn cuộn mượt. Tìm kiếm,
            lọc theo thể loại và xếp hàng những bài bạn muốn nghe.
          </p>
        </div>
        <div className="page-actions">
          <span className="stat-card">
            <span className="stat-value">10.000</span>
            <span className="stat-label">bài hát</span>
          </span>
        </div>
      </header>

      <section className="toolbar" aria-label="Bộ lọc thư viện">
        <div className="field field--search">
          <label className="field-label" htmlFor="song-search">
            Tìm kiếm
          </label>
          <div className="search-wrap">
            <span className="search-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="7" cy="7" r="4.6" stroke="currentColor" strokeWidth="1.5" />
                <path
                  d="m10.4 10.4 3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              id="song-search"
              className="input"
              type="search"
              placeholder="Tên bài hát hoặc ca sĩ..."
              value={query}
              onChange={handleQueryShift}
              autoComplete="off"
            />
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="genre-filter">
            Thể loại
          </label>
          <select
            id="genre-filter"
            className="select"
            value={genre}
            onChange={handleGenreChange}
          >
            <option value="All">Tất cả</option>
            {GENRES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="sort-filter">
            Sắp xếp
          </label>
          <select
            id="sort-filter"
            className="select"
            value={sort}
            onChange={handleSortChange}
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </section>

      <p className="result-line" aria-live="polite">
        Tìm thấy <span className="result-count">{filteredSongs.length}</span> bài hát
      </p>

      {filteredSongs.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">
            ♪
          </span>
          <strong>Không tìm thấy bài hát nào</strong>
          <span>Thử một từ khóa khác hoặc bỏ bớt bộ lọc thể loại.</span>
        </div>
      ) : (
        <>
          <div className="list-head" aria-hidden="true">
            <span>#</span>
            <span>Bài hát</span>
            <span className="list-head-genre">Thể loại</span>
            <span className="list-head-duration">Thời lượng</span>
            <span className="list-head-actions">Hành động</span>
          </div>
          <VirtualSongList
            songs={filteredSongs}
            onPlay={handlePlay}
            onAddToQueue={handleAddToQueue}
          />
        </>
      )}
    </div>
  );
}
