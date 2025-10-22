import { FC } from 'react';
import { Piece } from '@entities/Piece/Piece';
import { cx } from '@shared/libs/cx';
import styles from './CheckersPiece.module.css';
import { CheckersPieceProps } from './CheckersPiece.types';

export const CheckersPiece: FC<CheckersPieceProps> = (props) => {
  const { color, onClick, isClickable = true, isRemoving = false } = props;

  return (
    <Piece
      className={cx(
        styles.piece,
        isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-70',
      )}
      color={color}
      onClick={isClickable ? onClick : undefined}
      isRemoving={isRemoving}
    />
  );
};
