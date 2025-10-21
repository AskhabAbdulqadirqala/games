import { FC } from 'react';

import { cx } from '@shared/libs/cx';

import styles from './Piece.module.css';

import { PieceProps } from './Piece.types';

export const Piece: FC<PieceProps> = (props) => {
  const { color, className, onClick } = props;

  return (
    <button
      className={cx(styles.piece, styles[color], className)}
      onClick={onClick}
    />
  );
};
