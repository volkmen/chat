import React, { PropsWithChildren } from 'react';

function getElement(child: React.ReactNode, i: number, length: number) {
  if (i === 4 && length > 4) {
    return (
      <div className='relative bg-gray-900'>
        <div className='flex justify-center items-center opacity-50'>{child}</div>
        <div className='absolute-centered text-white'>+{length - 4}</div>
      </div>
    );
  }

  if (i <= 4) {
    return child;
  }
}

const UploadsLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const length = React.Children.count(children);

  return (
    <div className={`grid grid-cols-${length >= 2 ? 2 : 1}`}>
      {React.Children.map(children, (child, i) => getElement(child, i + 1, length))}
    </div>
  );
};

export default UploadsLayout;
