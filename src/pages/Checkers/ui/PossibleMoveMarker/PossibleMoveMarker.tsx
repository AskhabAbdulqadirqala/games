import { FC } from 'react';

import { PossibleMoveMarkerProps } from './PossibleMoveMarker.types';

export const PossibleMoveMarker: FC<PossibleMoveMarkerProps> = ({ onMove }) => (
  <button
    style={{ width: '100%', height: '100%', backgroundColor: '#caca67' }}
    onMouseUp={onMove}
    onClick={onMove}
  />
);
