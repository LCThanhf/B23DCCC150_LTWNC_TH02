import type { Playlist, PlaylistAction } from './playlistReducer';

type PlaylistReducer = (state: Playlist[], action: PlaylistAction) => Playlist[];

export const withLogger = (reducer: PlaylistReducer): PlaylistReducer => {
  return (state, action) => {
    const nextState = reducer(state, action);

    if (import.meta.env.DEV) {
      console.log(`[playlist] ${action.type}`, {
        action: action.payload,
        before: state,
        after: nextState,
      });
    }

    return nextState;
  };
};
