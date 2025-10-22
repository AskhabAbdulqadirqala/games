import { FC, useState, useRef, useEffect } from 'react';

import { cx } from '@shared/libs/cx';

import styles from './Piece.module.css';

import { PieceProps } from './Piece.types';

import { usePieceDragging } from './lib/hooks/usePieceDragging';

export const Piece: FC<PieceProps> = (props) => {
  const { color, className, onClick } = props;
  const { pieceRef, isDragging, handleMouseDown } = usePieceDragging(onClick);

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
