import React from 'react';
import { NewMessageContext } from 'contexts/NewMessage';
import { IoMdClose } from 'react-icons/io';
import Spinner from '../Spinner';
import classNames from 'classnames';

interface NewUploadsProps {
  className: string;
}

const NewUploads: React.FC<NewUploadsProps> = ({ className }) => {
  const { uploads, onDeleteUpload } = React.useContext(NewMessageContext);

  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className={classNames('flex justify-end', className)}>
      <div className='flex gap-1 rounded mr-3 bg-gray-100 p-2 border border-1 mt-3'>
        {uploads.map(upload => (
          <div className='relative' key={upload.url}>
            <img key={upload.url} src={upload.url} width='50px' height='50px' />
            <IoMdClose
              onClick={onDeleteUpload(upload.id)}
              className='cursor-pointer absolute fill-red-500 -right-2 z-10 -top-2'
              size={20}
            />
            {upload.loading && (
              <>
                <div className='absolute bg-opacity-50 bg-gray-100 w-full h-full top-0' />
                <Spinner className='scale-50' />
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewUploads;
