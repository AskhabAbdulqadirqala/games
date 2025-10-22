import { FC } from 'react';
import { cx } from '@shared/libs/cx';
import styles from './Piece.module.css';
import { PieceProps } from './Piece.types';
import { usePieceDragging } from './lib/hooks/usePieceDragging';
import { ExplodeEffect } from './ui/ExplodeEffect';


export const Piece: FC<PieceProps> = (props) => {
  const { color, className, onClick, isRemoving } = props;
  const { pieceRef, isDragging, handleMouseDown } = usePieceDragging(onClick);

  if (isRemoving) {
    return <ExplodeEffect color={color} className={className} />;
  }

  return (
    <button
      ref={pieceRef}
      className={cx(styles.piece, styles[color], className, {
        [styles.dragging]: isDragging,
      })}
      onMouseDown={handleMouseDown}
      onClick={onClick}
    />
  );
};
