import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CheckersState, Checker } from '../Checkers.types';
import { Position } from '@entities/Piece';
import { BOARD_SIZE, RED_PIECE_CODE, WHITE_PIECE_CODE } from '../config/constants';

const createInitialCheckers = () => {
  const checkers: Checker[] = [];

  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const isBlackCell = (row + col) % 2 === 1;
      const isWhitePiece = row < 3;
      const isRedPiece = row > 4;

      if (isBlackCell && (isWhitePiece || isRedPiece)) {
        checkers.push({
          id: `checker-${row}-${col}`,
          code: isWhitePiece ? WHITE_PIECE_CODE : RED_PIECE_CODE,
          position: { x: col, y: row }
        });
      }
    }
  }

  return checkers;
}

const initialState: CheckersState = {
  checkers: createInitialCheckers(),
  selectedCheckerId: '',
  possibleMoves: [],
  currentPlayer: WHITE_PIECE_CODE,
  removingCheckers: [],
};

export const checkersSlice = createSlice({
  name: 'checkers',
  initialState,
  reducers: {
    selectChecker: (state, action: PayloadAction<string>) => {
      state.selectedCheckerId = action.payload;
    },
    setPossibleMoves: (state, action: PayloadAction<Position[]>) => {
      state.possibleMoves = action.payload;
    },
    moveChecker: (state, action: PayloadAction<{ targetPos: Position; checkerId: string }>) => {
      const { targetPos, checkerId } = action.payload;
      const checkerIndex = state.checkers.findIndex(c => c.id === checkerId);
      
      if (checkerIndex !== -1) {
        state.checkers[checkerIndex].position = targetPos;
      }
    },
    removeChecker: (state, action: PayloadAction<string>) => {
      state.checkers = state.checkers.filter(c => c.id !== action.payload);
    },
    addRemovingChecker: (state, action: PayloadAction<string>) => {
      state.removingCheckers.push(action.payload);
    },
    removeRemovingChecker: (state, action: PayloadAction<string>) => {
      state.removingCheckers = state.removingCheckers.filter(id => id !== action.payload);
    },
    switchPlayer: (state) => {
      state.currentPlayer = state.currentPlayer === WHITE_PIECE_CODE ? 
        RED_PIECE_CODE : WHITE_PIECE_CODE;
    },
    resetGame: (state) => {
      state.checkers = createInitialCheckers();
      state.selectedCheckerId = '';
      state.possibleMoves = [];
      state.currentPlayer = WHITE_PIECE_CODE;
      state.removingCheckers = [];
    },
  },
});

export const {
  selectChecker,
  setPossibleMoves,
  moveChecker,
  removeChecker,
  addRemovingChecker,
  removeRemovingChecker,
  switchPlayer,
  resetGame,
} = checkersSlice.actions;

export default checkersSlice.reducer;
