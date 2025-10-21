import { FC } from 'react';
import _ from 'lodash';

import { isOdd } from '@shared/libs/numbers';
import { PieceState } from '@entities/Piece';

import styles from './Board.module.css';
import { Cell, CellColor } from './ui/BoardCell';

interface Props {
  boardState: (PieceState | null)[][];
}

export const Board: FC<Props> = ({ boardState }) => {
  return (
    <div className={styles.board}>
      {_.map(boardState, (row, rowIndex) =>
        _.map(row, (col, colIndex) => {
          const isBlackCell = isOdd(rowIndex + colIndex);
          const { PieceComponent } = boardState[rowIndex][colIndex] || {};

          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              color={isBlackCell ? CellColor.BLACK : CellColor.WHITE}
            >
              {PieceComponent}
            </Cell>
          );
        }),
      )}
    </div>
  );
};
