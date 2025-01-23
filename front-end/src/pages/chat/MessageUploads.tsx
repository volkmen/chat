import React from 'react';
import { MessageUploadType } from '../../types/chats';

interface MessageUploadsProps {
  uploads: MessageUploadType[];
}

const MessageUploads: React.FC<MessageUploadsProps> = ({ uploads }) => (
  <div className='grid grid-cols-2'>
    {uploads.slice(4).map(upload => (
      <img key={upload.url} src={upload.url} width={50} height={50} />
    ))}
  </div>
);

export default MessageUploads;
