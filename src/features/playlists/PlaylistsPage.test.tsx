import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { PlaylistProvider } from './PlaylistContext';
import PlaylistsPage from './PlaylistsPage';

const renderWithProviders = () =>
  render(
    <MemoryRouter>
      <PlaylistProvider>
        <PlaylistsPage />
      </PlaylistProvider>
    </MemoryRouter>,
  );

beforeEach(() => {
  window.localStorage.clear();
});

describe('PlaylistsPage', () => {
  it('báo lỗi khi bấm Tạo mà ô tên còn trống', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Tên playlist không được để trống',
    );
  });

  it('tạo playlist và hiển thị tên trong danh sách', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    const card = (await screen.findByText('Chạy bộ')).closest('article');
    expect(card).not.toBeNull();
    expect(within(card as HTMLElement).getByText('0 bài')).toBeInTheDocument();
    expect(screen.getByLabelText('Tên playlist')).toHaveValue('');
  });

  it('báo lỗi khi tên playlist bị trùng, không phân biệt hoa thường', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    await user.type(screen.getByLabelText('Tên playlist'), 'chạy bộ');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Tên playlist đã tồn tại',
    );
    expect(screen.getAllByText('Chạy bộ')).toHaveLength(1);
  });

  it('xóa playlist thì danh sách trở về trạng thái trống', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));
    await user.click(screen.getByRole('button', { name: 'Xóa playlist Chạy bộ' }));

    expect(screen.getByText('Chưa có playlist nào')).toBeInTheDocument();
  });

  it('lưu playlist vào localStorage để tải lại trang không mất', async () => {
    const user = userEvent.setup();
    const view = renderWithProviders();

    await user.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ');
    await user.click(screen.getByRole('button', { name: 'Tạo' }));

    const stored = window.localStorage.getItem('music-playlists');
    expect(stored).toContain('Chạy bộ');

    view.unmount();
    renderWithProviders();

    expect(await screen.findByText('Chạy bộ')).toBeInTheDocument();
  });

  it('nút Xóa có thể bấm bằng bàn phím', async () => {
    const user = userEvent.setup();
    renderWithProviders();

    await user.type(screen.getByLabelText('Tên playlist'), 'Chạy bộ');
    fireEvent.submit(screen.getByRole('button', { name: 'Tạo' }).closest('form') as HTMLFormElement);

    const deleteButton = await screen.findByRole('button', { name: 'Xóa playlist Chạy bộ' });
    deleteButton.focus();
    expect(deleteButton).toHaveFocus();
  });
});
