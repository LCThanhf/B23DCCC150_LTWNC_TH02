import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Song } from '../../types';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { SongRow } from './SongRow';

const song: Song = {
  id: 's1',
  title: 'Mưa tháng Sáu 1',
  artist: 'Lê Minh',
  genre: 'Pop',
  duration: 150,
};

const renderRow = () => {
  const onPlay = vi.fn();
  const onAddToQueue = vi.fn();

  render(<SongRow song={song} index={0} onPlay={onPlay} onAddToQueue={onAddToQueue} />);

  return { onPlay, onAddToQueue };
};

beforeEach(() => {
  window.localStorage.clear();
  useFavoritesStore.setState({ ids: [] });
});

describe('SongRow', () => {
  it('hiển thị tên bài hát và thời lượng dạng phút:giây', () => {
    renderRow();

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('Lê Minh')).toBeInTheDocument();
    expect(screen.getByText('2:30')).toBeInTheDocument();
  });

  it('bấm nút Phát thì gọi onPlay với đúng bài hát', () => {
    const { onPlay } = renderRow();

    fireEvent.click(screen.getByRole('button', { name: /Phát/ }));

    expect(onPlay).toHaveBeenCalledTimes(1);
    expect(onPlay).toHaveBeenCalledWith(song);
  });

  it('bấm nút hàng đợi thì gọi onAddToQueue với đúng bài hát', () => {
    const { onAddToQueue } = renderRow();

    fireEvent.click(screen.getByRole('button', { name: '+ Hàng đợi' }));

    expect(onAddToQueue).toHaveBeenCalledWith(song);
  });

  it('đổi biểu tượng trái tim và cập nhật store yêu thích', () => {
    renderRow();

    fireEvent.click(screen.getByRole('button', { name: 'Thêm vào yêu thích' }));

    expect(useFavoritesStore.getState().ids).toEqual(['s1']);
    expect(screen.getByRole('button', { name: 'Bỏ yêu thích' })).toHaveTextContent('♥');

    fireEvent.click(screen.getByRole('button', { name: 'Bỏ yêu thích' }));

    expect(useFavoritesStore.getState().ids).toEqual([]);
  });

  it('khóa nút + Playlist khi chưa chọn playlist', () => {
    render(
      <SongRow
        song={song}
        index={0}
        onPlay={vi.fn()}
        onAddToQueue={vi.fn()}
        onAddToPlaylist={vi.fn()}
        playlistDisabled
      />,
    );

    expect(
      screen.getByRole('button', { name: '+ Playlist' }),
    ).toBeDisabled();
  });
});
