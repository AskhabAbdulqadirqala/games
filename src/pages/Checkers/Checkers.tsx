import { FC, useCallback } from 'react';
import { map, range } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

import { Board } from '@widgets/Board';
import { PieceColor, Position, PieceState } from '@entities/Piece';

import { CheckersPiece } from './ui/CheckersPiece';
import { PossibleMoveMarker } from './ui/PossibleMoveMarker';

import { Checker } from './Checkers.types';

import { BOARD_SIZE, WHITE_PIECE_CODE, RED_PIECE_CODE } from './config/constants';

import {
  selectCheckers,
  selectSelectedCheckerId,
  selectPossibleMoves,
  selectCurrentPlayer,
  selectRemovingCheckers,
} from './store/selectors';
import {
  selectChecker,
  setPossibleMoves,
  moveChecker,
  removeChecker,
  addRemovingChecker,
  removeRemovingChecker,
  switchPlayer,
} from './store/slice';

const boardRange = range(BOARD_SIZE);

const getPossibleMoves = (checkers: Checker[], fromY: number, fromX: number, currentPlayer: number) => {
  const moves: Position[] = [];
  const checker = checkers.find(c => c.position.x === fromX && c.position.y === fromY);
  
  if (!checker) return moves;

  // Проверяем, что шашка принадлежит текущему игроку
  if (checker.code !== currentPlayer) return moves;

  const isWhite = checker.code === WHITE_PIECE_CODE;
  const direction = isWhite ? 1 : -1;
  const maxSteps = 1;

  const directions = [
    { dx: -1, dy: direction },
    { dx: 1, dy: direction },
  ];

  for (const { dx, dy } of directions) {
    for (let step = 1; step <= maxSteps; step++) {
      const nx = fromX + dx * step;
      const ny = fromY + dy * step;

      if (nx < 0 || nx >= BOARD_SIZE || ny < 0 || ny >= BOARD_SIZE) break;

      const cellHasChecker = checkers.some(c => c.position.x === nx && c.position.y === ny);

      if (!cellHasChecker) {
        moves.push({ x: nx, y: ny });
        continue;
      }

      const enemyChecker = checkers.find(c => c.position.x === nx && c.position.y === ny);

      if (enemyChecker && enemyChecker.code !== checker.code) {
        const jumpX = fromX + dx * (step + 1);
        const jumpY = fromY + dy * (step + 1);
        
        if (
          jumpX >= 0 && jumpX < BOARD_SIZE &&
          jumpY >= 0 && jumpY < BOARD_SIZE &&
          !checkers.some(c => c.position.x === jumpX && c.position.y === jumpY)
        ) {
          moves.push({ x: jumpX, y: jumpY });
        }
      }
      break;
    }
  }

  return moves;
}

const checkersToBoardState = (
  checkers: Checker[], 
  handlePieceClick: (id: string) => void,
  moveMarkers: Position[] = [],
  handleMove: (targetPos: Position, checkerId: string) => void = () => {},
  selectedCheckerId: string,
  currentPlayer: number,
  removingCheckers: string[],
) => {
  const boardState: (PieceState | null)[][] = map(boardRange, () => 
    map(boardRange, () => null)
  );

  checkers.forEach(checker => {
    const { x, y } = checker.position;
    const isClickable = checker.code === currentPlayer;
    const isRemoving = removingCheckers.includes(checker.id);
    
    boardState[y][x] = {
      id: checker.id,
      code: checker.code,
      PieceComponent: (
        <CheckersPiece
          color={checker.code === WHITE_PIECE_CODE ? PieceColor.WHITE : PieceColor.RED}
          onClick={isClickable && !isRemoving ? () => handlePieceClick(checker.id) : undefined}
          isClickable={isClickable && !isRemoving}
          isRemoving={isRemoving}
        />
      ),
    };
  });

  moveMarkers.forEach(marker => {
    boardState[marker.y][marker.x] = {
      id: `move-${marker.y}-${marker.x}`,
      code: 0,
      PieceComponent: (
        <PossibleMoveMarker onMove={() => handleMove(marker, selectedCheckerId)} />
      ),
    };
  });

  return boardState;
}

export const CheckersPage: FC = () => {
  const dispatch = useDispatch();
  const checkers = useSelector(selectCheckers);
  const selectedCheckerId = useSelector(selectSelectedCheckerId);
  const possibleMoves = useSelector(selectPossibleMoves);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const removingCheckers = useSelector(selectRemovingCheckers);

  const handlePieceClick = useCallback((id: string) => {
    const checker = checkers.find(c => c.id === id);
    if (!checker) return;

    // Проверяем, что кликнули на шашку текущего игрока
    if (checker.code !== currentPlayer) return;

    dispatch(selectChecker(id));
    const moves = getPossibleMoves(checkers, checker.position.y, checker.position.x, currentPlayer);
    dispatch(setPossibleMoves(moves));
  }, [checkers, currentPlayer, dispatch]);

  const handleMove = useCallback((targetPos: Position, checkerId: string) => {
    const checker = checkers.find(c => c.id === checkerId);
    if (!checker) {
      return;
    }

    const dx = targetPos.x - checker.position.x;
    const dy = targetPos.y - checker.position.y;

    // Проверяем взятие
    if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
      const eatenX = checker.position.x + dx / 2;
      const eatenY = checker.position.y + dy / 2;
      const eatenChecker = checkers.find(
        c => c.position.x === eatenX && c.position.y === eatenY
      );

      if (eatenChecker) {
        dispatch(addRemovingChecker(eatenChecker.id));
        setTimeout(() => {
          dispatch(removeChecker(eatenChecker.id));
          dispatch(removeRemovingChecker(eatenChecker.id));
        }, 500);
      }
    }

    dispatch(moveChecker({ targetPos, checkerId }));

    // Проверка превращения в дамку
    const movedChecker = checkers.find(c => c.id === checkerId);
    if (movedChecker) {
      if (
        (movedChecker.code === WHITE_PIECE_CODE && targetPos.y === BOARD_SIZE - 1) ||
        (movedChecker.code === RED_PIECE_CODE && targetPos.y === 0)
      ) {
        console.log(`Шашка ${movedChecker.id} превратилась в дамку!`);
      }
    }

    dispatch(switchPlayer());
    dispatch(selectChecker(''));
    dispatch(setPossibleMoves([]));
  }, [checkers, dispatch]);

  const boardState = checkersToBoardState(
    checkers,
    handlePieceClick,
    possibleMoves,
    handleMove,
    selectedCheckerId,
    currentPlayer,
    removingCheckers
  );

  return (
    <div>
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: currentPlayer === WHITE_PIECE_CODE ? '#f0f0f0' : '#ffcccc',
        border: '2px solid #333',
        borderRadius: '5px',
        textAlign: 'center',
        fontWeight: 'bold'
      }}>
        {currentPlayer === WHITE_PIECE_CODE ? 'Ход белых' : 'Ход красных'}
      </div>
      <Board boardState={boardState} />
    </div>
  );
};
