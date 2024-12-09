import React, { FormEventHandler } from 'react';
import { Button, Textarea } from 'flowbite-react';
import { preventDefault } from 'utils/events';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from 'api/chats';

interface SendMessageProps {
  chatId: number;
  onSendMessage?: () => void;
  className?: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ chatId, onSendMessage }) => {
  const [value, setValue] = React.useState('');
  const [submitMessage] = useMutation<number, { chatId: number; content: string }>(SEND_MESSAGE);
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  const onSubmit: FormEventHandler = e => {
    preventDefault(e);
    submitMessage({
      variables: {
        chatId,
        content: value
      }
    }).then(() => {
      onSendMessage?.();
      setValue('');
      ref.current?.focus();
    });
  };

  return (
    <form onSubmit={onSubmit} className='flex gap-2 align-bottom'>
      <Textarea
        style={{ resize: 'vertical' }}
        className={'w-full bg-white block'}
        value={value}
        rows={3}
        onChange={e => setValue(e.target.value)}
        ref={ref}
      />
      <Button size='xs' type='submit' className='self-end px-2'>
        Send
      </Button>
    </form>
  );
};

export default SendMessage;
