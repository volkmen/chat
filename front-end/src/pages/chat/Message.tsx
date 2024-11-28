import React from 'react';
import { MessageType } from 'types/chats';
import classNames from 'classnames';
import { User } from 'types/users';
import relativeDate from 'relative-date';
import { IoCheckmarkDoneOutline } from 'react-icons/io5';
import { IoCheckmarkOutline } from 'react-icons/io5';

interface MessageProps {
  message: MessageType;
  me: User;
  className?: string;
  correspondent: {
    username: string;
  };
}

const Message: React.FC<MessageProps> = ({ message, correspondent, className, me }) => {
  const isMineMessage = me.id === message.sender_id;
  const senderName = isMineMessage ? 'Me' : correspondent.username;
  const relTime = relativeDate(message.created_at);
  const status = !message.is_read ? <IoCheckmarkDoneOutline color='#0000E7' /> : <IoCheckmarkOutline color='#888' />;
  const borderClassName = isMineMessage
    ? 'mr-4 rounded-s-xl rounded-ee-xl bg-blue-100'
    : 'ml-4 rounded-e-xl rounded-es-xl bg-red-100';

  return (
    <div className={classNames('flex msg-item arrow-right', isMineMessage && 'justify-end', className)}>
      <div className={classNames('flex items-start gap-2.5 min-w-64 max-w-lg md:max-w-2xl')}>
        <div
          className={classNames(
            'flex flex-col w-full leading-1.5 p-4 border-gray-200 dark:bg-gray-700',
            borderClassName
          )}
        >
          <div className='flex items-center space-x-2 rtl:space-x-reverse justify-between'>
            <span className='text-sm font-semibold text-gray-900 dark:text-white'>{senderName}</span>
            <span className='font-normal text-gray-500 dark:text-gray-400 text-xs'>{relTime}</span>
          </div>
          <p className='text-sm font-normal py-2.5 text-gray-900 dark:text-white'>{message.content}</p>
          {isMineMessage && (
            <div className='flex justify-end text-end font-normal text-gray-500 dark:text-gray-400'>{status}</div>
          )}
        </div>
      </div>
    </div>
  );
};

// return <div classNameName='card'>{message.content}</div>;

export default Message;