import { ReactEventHandler } from 'react';

export const preventDefault: ReactEventHandler = e => {
  e.preventDefault();
};
