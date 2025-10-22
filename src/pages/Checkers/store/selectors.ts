import { RootState } from '@app/store';

export const selectCheckers = (state: RootState) => state.checkers.checkers;
export const selectSelectedCheckerId = (state: RootState) =>
  state.checkers.selectedCheckerId;
export const selectPossibleMoves = (state: RootState) =>
  state.checkers.possibleMoves;
export const selectCurrentPlayer = (state: RootState) =>
  state.checkers.currentPlayer;
export const selectRemovingCheckers = (state: RootState) =>
  state.checkers.removingCheckers;
