import { FC } from 'react';

import { cx } from '@shared/libs/cx';

import styles from './Cell.module.css';

import { BoardCellProps } from './Cell.types';

export const Cell: FC<BoardCellProps> = (props) => {
  const { color, children } = props;

  return <div className={cx(styles.cell, styles[color])}>{children}</div>;
};
