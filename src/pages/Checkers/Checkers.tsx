import { FC, useState, useCallback } from 'react';
import { cloneDeep, each, map, range } from 'lodash';

import { Board } from '@widgets/Board';
import { PieceColor, Position, PieceState } from '@entities/Piece';

import { CheckersPiece } from './ui/CheckersPiece';
import { PossibleMoveMarker } from './ui/PossibleMoveMarker';

import { Checker } from './Checkers.types';

import { BOARD_SIZE, WHITE_PIECE_CODE, RED_PIECE_CODE } from './config/constants';

const boardRange = range(BOARD_SIZE);

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
  currentPlayer: number
) => {
  const boardState: (PieceState | null)[][] = map(boardRange, () => 
    map(boardRange, () => null)
  );

  checkers.forEach(checker => {
    const { x, y } = checker.position;
    const isClickable = checker.code === currentPlayer;
    
    boardState[y][x] = {
      id: checker.id,
      code: checker.code,
      PieceComponent: (
        <CheckersPiece
          color={checker.code === WHITE_PIECE_CODE ? PieceColor.WHITE : PieceColor.RED}
          onClick={isClickable ? () => handlePieceClick(checker.id) : undefined}
          isClickable={isClickable}
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
  const [checkers, setCheckers] = useState<Checker[]>(createInitialCheckers);
  console.log(checkers)
  const [selectedCheckerId, setSelectedCheckerId] = useState<string>('');
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(WHITE_PIECE_CODE); // Белые ходят первыми

  const handlePieceClick = useCallback((id: string) => {
    const checker = checkers.find(c => c.id === id);
    if (!checker) return;

    // Проверяем, что кликнули на шашку текущего игрока
    if (checker.code !== currentPlayer) return;

    setSelectedCheckerId(id);
    const moves = getPossibleMoves(checkers, checker.position.y, checker.position.x, currentPlayer);
    setPossibleMoves(moves);
  }, [checkers, currentPlayer]);

  const handleMove = useCallback((targetPos: Position, checkerId: string) => {
    setCheckers(prevCheckers => {
      const newCheckers = cloneDeep(prevCheckers);
      const checkerIndex = newCheckers.findIndex(c => c.id === checkerId);
      
      if (checkerIndex !== -1) {
        // Обновляем позицию шашки
        newCheckers[checkerIndex].position = targetPos;

        // Проверяем, был ли это ход со взятием
        const fromChecker = prevCheckers[checkerIndex];
        const dx = targetPos.x - fromChecker.position.x;
        const dy = targetPos.y - fromChecker.position.y;
        
        if (Math.abs(dx) === 2 && Math.abs(dy) === 2) {
          // Удаляем съеденную шашку
          const eatenX = fromChecker.position.x + dx / 2;
          const eatenY = fromChecker.position.y + dy / 2;
          const eatenIndex = newCheckers.findIndex(
            c => c.position.x === eatenX && c.position.y === eatenY
          );

          if (eatenIndex !== -1) {
            newCheckers.splice(eatenIndex, 1);
          }
        }

        // Проверяем превращение в дамку
        const movedChecker = newCheckers[checkerIndex];
        if (
          (movedChecker.code === WHITE_PIECE_CODE && targetPos.y === BOARD_SIZE - 1) ||
          (movedChecker.code === RED_PIECE_CODE && targetPos.y === 0)
        ) {
          // Здесь можно добавить логику превращения в дамку
          console.log(`Шашка ${movedChecker.id} превратилась в дамку!`);
        }
      }

      return newCheckers;
    });

    // Передаем ход другому игроку
    setCurrentPlayer(prevPlayer => 
      prevPlayer === WHITE_PIECE_CODE ? RED_PIECE_CODE : WHITE_PIECE_CODE
    );
    
    setSelectedCheckerId('');
    setPossibleMoves([]);
  }, []);

  const boardState = checkersToBoardState(
    checkers,
    handlePieceClick,
    possibleMoves,
    handleMove,
    selectedCheckerId,
    currentPlayer
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
