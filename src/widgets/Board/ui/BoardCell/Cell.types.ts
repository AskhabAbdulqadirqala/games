export enum CellColor {
  BLACK = 'black',
  WHITE = 'white',
}

export interface BoardCellProps {
  color: CellColor;
  children?: React.ReactNode;
}
