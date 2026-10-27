import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { usePlayerStore } from '../player/usePlayerStore';
import { PlaylistProvider } from './PlaylistContext';
import PlaylistDetailPage from './PlaylistDetailPage';

const renderDetail = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <PlaylistProvider>
        <Routes>
          <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
        </Routes>
      </PlaylistProvider>
    </MemoryRouter>,
  );

const seedPlaylist = () => {
  window.localStorage.setItem(
    'music-playlists',
    JSON.stringify([
      { id: 'p1', name: 'Chạy bộ', songIds: ['s1', 's2'] },
    ]),
  );
};

beforeEach(() => {
  window.localStorage.clear();
  usePlayerStore.setState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    position: 0,
  });
});

describe('PlaylistDetailPage', () => {
  it('hiển thị bài hát và tổng thời lượng của playlist', () => {
    seedPlaylist();
    renderDetail('/playlists/p1');

    expect(screen.getByRole('heading', { name: 'Chạy bộ' })).toBeInTheDocument();
    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Tổng thời lượng: 5 phút 37 giây')).toBeInTheDocument();
  });

  it('phát tất cả bài hát trong playlist', () => {
    seedPlaylist();
    renderDetail('/playlists/p1');

    fireEvent.click(screen.getByRole('button', { name: 'Phát tất cả' }));

    expect(usePlayerStore.getState().queue).toHaveLength(2);
    expect(usePlayerStore.getState().queue[0].id).toBe('s1');
    expect(usePlayerStore.getState().isPlaying).toBe(true);
  });

  it('bỏ một bài khỏi playlist', () => {
    seedPlaylist();
    renderDetail('/playlists/p1');

    fireEvent.click(screen.getAllByRole('button', { name: 'Bỏ' })[0]);

    expect(screen.queryByText('Mưa tháng Sáu 1')).not.toBeInTheDocument();
    expect(screen.getByText('Nắng tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Tổng thời lượng: 3 phút 7 giây')).toBeInTheDocument();
  });

  it('báo không tìm thấy khi id playlist không tồn tại', () => {
    seedPlaylist();
    renderDetail('/playlists/khong-co');

    expect(screen.getByText('Không tìm thấy playlist')).toBeInTheDocument();
  });
});
