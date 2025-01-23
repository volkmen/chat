import React from 'react';
import classNames from 'classnames';

interface SpinnerProps {
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ className }) => (
  <div
    className={classNames(
      'h-full w-full flex flex-col justify-center items-center absolute top-0 text-center left-0',
      className
    )}
  >
    <div className='loader'></div>
  </div>
);

export default Spinner;
