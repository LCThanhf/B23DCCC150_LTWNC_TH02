import { create } from 'zustand';
import type { Song } from '../../types';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  position: 0,

  playQueue: (songs, startIndex) => {
    if (songs.length === 0) {
      set({ queue: [], currentIndex: -1, isPlaying: false, position: 0 });
      return;
    }

    const safeIndex = Math.min(Math.max(startIndex, 0), songs.length - 1);
    set({
      queue: [...songs],
      currentIndex: safeIndex,
      isPlaying: true,
      position: 0,
    });
  },

  togglePlay: () => {
    const { isPlaying, currentIndex } = get();
    if (currentIndex < 0) return;
    set({ isPlaying: !isPlaying });
  },

  next: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0 || currentIndex < 0) return;

    if (currentIndex < queue.length - 1) {
      set({ currentIndex: currentIndex + 1, position: 0, isPlaying: true });
      return;
    }

    set({ isPlaying: false, position: 0 });
  },

  prev: () => {
    const { queue, currentIndex, position } = get();
    if (queue.length === 0 || currentIndex < 0) return;

    if (position > 3 || currentIndex === 0) {
      set({ position: 0 });
      return;
    }

    set({ currentIndex: currentIndex - 1, position: 0 });
  },

  addToQueue: (song) => {
    const { queue } = get();
    if (queue.some((item) => item.id === song.id)) return;
    set({ queue: [...queue, song] });
  },

  tick: () => {
    const { queue, currentIndex, position, isPlaying } = get();
    if (!isPlaying || currentIndex < 0 || currentIndex >= queue.length) return;

    const current = queue[currentIndex];
    if (position + 1 >= current.duration) {
      get().next();
      return;
    }

    set({ position: position + 1 });
  },
}));
