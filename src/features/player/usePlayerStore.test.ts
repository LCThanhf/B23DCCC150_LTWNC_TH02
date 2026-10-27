import { beforeEach, describe, expect, it } from 'vitest';
import { generateSongs } from '../../data/songs';
import { usePlayerStore } from './usePlayerStore';

const [first, second] = generateSongs(3);

beforeEach(() => {
  usePlayerStore.setState({
    queue: [],
    currentIndex: -1,
    isPlaying: false,
    position: 0,
  });
});

describe('usePlayerStore', () => {
  it('playQueue đặt đúng bài đang phát và tua về 0:00', () => {
    usePlayerStore.getState().playQueue([first, second], 1);
    const state = usePlayerStore.getState();

    expect(state.queue).toEqual([first, second]);
    expect(state.currentIndex).toBe(1);
    expect(state.isPlaying).toBe(true);
    expect(state.position).toBe(0);
  });

  it('tick ở giây cuối tự động sang bài sau', () => {
    usePlayerStore.setState({
      queue: [first, second],
      currentIndex: 0,
      isPlaying: true,
      position: first.duration - 1,
    });

    usePlayerStore.getState().tick();
    const state = usePlayerStore.getState();

    expect(state.currentIndex).toBe(1);
    expect(state.position).toBe(0);
    expect(state.isPlaying).toBe(true);
  });

  it('next ở bài cuối thì dừng phát', () => {
    usePlayerStore.setState({
      queue: [first, second],
      currentIndex: 1,
      isPlaying: true,
      position: 12,
    });

    usePlayerStore.getState().next();

    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().currentIndex).toBe(1);
  });

  it('prev khi đã phát quá 3 giây chỉ tua về 0:00', () => {
    usePlayerStore.setState({
      queue: [first, second],
      currentIndex: 1,
      isPlaying: true,
      position: 7,
    });

    usePlayerStore.getState().prev();

    expect(usePlayerStore.getState().currentIndex).toBe(1);
    expect(usePlayerStore.getState().position).toBe(0);
  });

  it('prev khi chưa quá 3 giây lùi về bài trước', () => {
    usePlayerStore.setState({
      queue: [first, second],
      currentIndex: 1,
      isPlaying: true,
      position: 2,
    });

    usePlayerStore.getState().prev();

    expect(usePlayerStore.getState().currentIndex).toBe(0);
    expect(usePlayerStore.getState().position).toBe(0);
  });

  it('addToQueue bỏ qua bài đã có trong hàng đợi', () => {
    usePlayerStore.getState().playQueue([first], 0);
    usePlayerStore.getState().addToQueue(first);
    usePlayerStore.getState().addToQueue(second);

    expect(usePlayerStore.getState().queue).toEqual([first, second]);
  });

  it('tick ở giây cuối của bài cuối thì dừng phát', () => {
    usePlayerStore.setState({
      queue: [first],
      currentIndex: 0,
      isPlaying: true,
      position: first.duration - 1,
    });

    usePlayerStore.getState().tick();

    expect(usePlayerStore.getState().isPlaying).toBe(false);
    expect(usePlayerStore.getState().position).toBe(0);
  });

  it('togglePlay không làm gì khi chưa có bài nào', () => {
    usePlayerStore.getState().togglePlay();

    expect(usePlayerStore.getState().isPlaying).toBe(false);
  });
});
