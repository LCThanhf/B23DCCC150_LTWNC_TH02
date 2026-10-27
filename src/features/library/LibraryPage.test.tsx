import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LibraryPage from './LibraryPage';
import { PlaylistProvider } from '../playlists/PlaylistContext';
import { usePlayerStore } from '../player/usePlayerStore';

const renderLibrary = () =>
  render(
    <PlaylistProvider>
      <LibraryPage />
    </PlaylistProvider>,
  );

const changeSearch = (value: string) => {
  fireEvent.change(screen.getByLabelText('Tìm kiếm'), { target: { value } });
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

afterEach(() => {
  vi.useRealTimers();
});

describe('LibraryPage', () => {
  it('chỉ lọc sau khi ngừng gõ 300ms', () => {
    vi.useFakeTimers();
    renderLibrary();

    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    changeSearch('mưa');
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(screen.getByText('Tìm thấy 10000 bài hát')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByText('Tìm thấy 1250 bài hát')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Thể loại'), {
      target: { value: 'Rock' },
    });
    expect(screen.getByText('Tìm thấy 250 bài hát')).toBeInTheDocument();
  });

  it('tìm theo tên ca sĩ và báo trống khi không có kết quả', () => {
    vi.useFakeTimers();
    renderLibrary();

    changeSearch('thu hà');
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Tìm thấy 1000 bài hát')).toBeInTheDocument();

    changeSearch('xyz');
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(screen.getByText('Không tìm thấy bài hát nào')).toBeInTheDocument();
  });

  it('sắp xếp tên A–Z thì bài đầu tiên là Biển bình yên 1', () => {
    renderLibrary();

    fireEvent.change(screen.getByLabelText('Sắp xếp'), {
      target: { value: 'title' },
    });

    expect(screen.getByText('Biển bình yên 1')).toBeInTheDocument();
  });

  it('phát từ danh sách đã lọc và thêm bài vào hàng đợi', () => {
    vi.useFakeTimers();
    renderLibrary();

    changeSearch('mưa');
    act(() => {
      vi.advanceTimersByTime(300);
    });

    fireEvent.click(screen.getAllByRole('button', { name: 'Phát' })[0]);

    const queue = usePlayerStore.getState().queue;
    expect(queue).toHaveLength(1250);
    expect(usePlayerStore.getState().currentIndex).toBe(0);
    expect(
      queue.every(
        (song) =>
          song.title.toLowerCase().includes('mưa') ||
          song.artist.toLowerCase().includes('mưa'),
      ),
    ).toBe(true);

    usePlayerStore.getState().next();
    expect(usePlayerStore.getState().queue[usePlayerStore.getState().currentIndex].title).toContain(
      'Mưa',
    );
  });

  it('thêm bài vào hàng đợi và bỏ qua bài trùng', () => {
    renderLibrary();

    fireEvent.click(screen.getAllByRole('button', { name: '+ Hàng đợi' })[0]);
    fireEvent.click(screen.getAllByRole('button', { name: '+ Hàng đợi' })[0]);

    expect(usePlayerStore.getState().queue).toHaveLength(1);
    expect(usePlayerStore.getState().queue[0].id).toBe('s1');
  });

  it('thêm bài vào playlist đang chọn và lưu lại', async () => {
    window.localStorage.setItem(
      'music-playlists',
      JSON.stringify([{ id: 'p1', name: 'Chạy bộ', songIds: [] }]),
    );

    renderLibrary();

    expect(
      screen.getAllByRole('button', { name: '+ Playlist' })[0],
    ).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Playlist đang chọn'), {
      target: { value: 'p1' },
    });

    const addButton = screen.getAllByRole('button', { name: '+ Playlist' })[0];
    expect(addButton).toBeEnabled();
    fireEvent.click(addButton);

    await waitFor(() => {
      const stored = JSON.parse(
        window.localStorage.getItem('music-playlists') ?? '[]',
      ) as { songIds: string[] }[];
      expect(stored[0].songIds).toEqual(['s1']);
    });
  });
});
