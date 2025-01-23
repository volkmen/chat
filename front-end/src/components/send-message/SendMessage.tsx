import React, { FormEventHandler } from 'react';
import { Button, Textarea } from 'flowbite-react';
import { preventDefault } from 'utils/events';
import AttachFile from './AttachFile';
import { NewMessageContext } from 'contexts/NewMessage';

interface SendMessageProps {
  chatId: number;
  className?: string;
  onSendMessage?: () => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ onSendMessage }) => {
  const { onSubmit, newMessage, setNewMessage, onTyping, isTyping } = React.useContext(NewMessageContext);
  const ref = React.useRef<HTMLTextAreaElement | null>(null);

  const onClickSubmit: FormEventHandler = e => {
    preventDefault(e);
    onSendMessage?.();

    return onSubmit().then(() => {
      if (ref.current) {
        ref.current.focus();
      }
    });
  };

  const onBlur = () => {
    if (isTyping) {
      onTyping(false);
    }
  };

  React.useEffect(() => onBlur, []);

  return (
    <form onSubmit={onClickSubmit} className='flex gap-2 align-bottom relative pt-8'>
      <Textarea
        style={{ resize: 'vertical' }}
        className={'w-full bg-white block'}
        value={newMessage}
        rows={3}
        onChange={e => setNewMessage(e.target.value)}
        ref={ref}
        onFocus={() => onTyping(true)}
        onBlur={onBlur}
      />

      <div className='absolute top-0 flex'>
        <AttachFile />
      </div>

      <Button size='xs' type='submit' className='self-end px-2'>
        Send
      </Button>
    </form>
  );
};

export default SendMessage;
