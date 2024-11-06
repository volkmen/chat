import React, { EventHandler } from 'react';

export const preventDefault: EventHandler<any> = e => {
  e.preventDefault();
};
