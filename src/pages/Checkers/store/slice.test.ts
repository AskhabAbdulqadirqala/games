import { Position } from '@shared/types/board.types';

import reducer, {
  selectChecker,
  setPossibleMoves,
  moveChecker,
  removeChecker,
  addRemovingChecker,
  removeRemovingChecker,
  switchPlayer,
  resetGame,
  updateGameState,
} from './slice';

import { WHITE_PIECE_CODE, RED_PIECE_CODE } from '../config/constants';

describe('checkers slice (Jest)', () => {
  const getInitial = () => reducer(undefined, { type: '@@INIT' });

  it('initial state has 24 checkers and white to start', () => {
    const state = getInitial();

    expect(Array.isArray(state.checkers)).toBe(true);
    expect(state.checkers.length).toBe(24);
    expect(state.currentPlayer).toBe(WHITE_PIECE_CODE);
    expect(state.selectedCheckerId).toBe('');
    expect(state.possibleMoves).toEqual([]);
    expect(state.removingCheckers).toEqual([]);
  });

  it('selectChecker sets selectedCheckerId', () => {
    const state = getInitial();
    const id = state.checkers[0].id;
    const next = reducer(state, selectChecker(id));

    expect(next.selectedCheckerId).toBe(id);
  });

  it('setPossibleMoves stores moves', () => {
    const state = getInitial();
    const moves: Position[] = [{ x: 0, y: 1 }];
    const next = reducer(state, setPossibleMoves(moves));

    expect(next.possibleMoves).toEqual(moves);
  });

  it('moveChecker updates checker position', () => {
    const state = getInitial();
    const checker = state.checkers[0];
    const targetPos = { x: checker.position.x, y: checker.position.y + 1 };
    const next = reducer(
      state,
      moveChecker({ targetPos, checkerId: checker.id }),
    );
    const moved = next.checkers.find((c) => c.id === checker.id);

    expect(moved).toBeDefined();
    expect(moved?.position).toEqual(targetPos);
  });

  it('removeChecker deletes checker by id', () => {
    const state = getInitial();
    const id = state.checkers[0].id;
    const next = reducer(state, removeChecker(id));

    expect(next.checkers.some((c: any) => c.id === id)).toBe(false);
    expect(next.checkers.length).toBe(state.checkers.length - 1);
  });

  it('addRemovingChecker and removeRemovingChecker manage removingCheckers', () => {
    const state = getInitial();
    const id = 'test-removing';
    const withAdded = reducer(state, addRemovingChecker(id));

    expect(withAdded.removingCheckers).toContain(id);

    const withRemoved = reducer(withAdded, removeRemovingChecker(id));

    expect(withRemoved.removingCheckers).not.toContain(id);
  });

  it('switchPlayer toggles currentPlayer', () => {
    const state = getInitial();
    const next = reducer(state, switchPlayer());

    expect(next.currentPlayer).toBe(RED_PIECE_CODE);

    const next2 = reducer(next, switchPlayer());

    expect(next2.currentPlayer).toBe(WHITE_PIECE_CODE);
  });

  it('resetGame restores initial layout and state', () => {
    const state = getInitial();
    const modified = {
      ...state,
      checkers: [],
      selectedCheckerId: 'x',
      possibleMoves: [{ x: 1, y: 1 }],
      currentPlayer: RED_PIECE_CODE,
      removingCheckers: ['a'],
    };
    const reset = reducer(modified, resetGame());

    expect(reset.checkers.length).toBe(24);
    expect(reset.selectedCheckerId).toBe('');
    expect(reset.possibleMoves).toEqual([]);
    expect(reset.currentPlayer).toBe(WHITE_PIECE_CODE);
    expect(reset.removingCheckers).toEqual([]);
  });

  it('updateGameState replaces checkers and resets selection/moves and flips player', () => {
    const state = getInitial();
    const fakeCheckers = [{ id: 'c1', code: 1, position: { x: 0, y: 0 } }];
    const next = reducer(state, updateGameState({ checkers: fakeCheckers }));

    expect(next.checkers).toEqual(fakeCheckers);
    expect(next.selectedCheckerId).toBe('');
    expect(next.possibleMoves).toEqual([]);
    expect(next.currentPlayer).toBe(RED_PIECE_CODE);
  });
});
