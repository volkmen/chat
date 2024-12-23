import React, { FormEventHandler } from 'react';
import { Button, Textarea } from 'flowbite-react';
import { preventDefault } from 'utils/events';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DO_TYPING, SEND_MESSAGE } from 'api/messages';

interface SendMessageProps {
  chatId: number;
  className?: string;
  onSendMessage?: () => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ chatId, onSendMessage }) => {
  const [value, setValue] = React.useState('');
  const [submitMessage] = useMutation<number, { chatId: number; content: string }>(SEND_MESSAGE);
  const [doTyping, { data }] = useLazyQuery<{ DoTyping: boolean }>(DO_TYPING, {
    fetchPolicy: 'network-only'
  });
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  // console.log(data);
  const onSubmit: FormEventHandler = e => {
    preventDefault(e);
    onSendMessage?.();
    submitMessage({
      variables: {
        chatId,
        content: value
      }
    }).then(() => {
      setValue('');
      ref.current?.focus();
    });
  };

  const onFocus = () => {
    doTyping({ variables: { chatId, isTyping: true } });
  };

  const onBlur = () => {
    if (data?.DoTyping) {
      doTyping({ variables: { chatId, isTyping: false } });
    }
  };

  React.useEffect(() => onBlur, []);

  return (
    <form onSubmit={onSubmit} className='flex gap-2 align-bottom'>
      <Textarea
        style={{ resize: 'vertical' }}
        className={'w-full bg-white block'}
        value={value}
        rows={3}
        onChange={e => setValue(e.target.value)}
        ref={ref}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      <Button size='xs' type='submit' className='self-end px-2'>
        Send
      </Button>
    </form>
  );
};

export default SendMessage;
