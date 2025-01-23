import React, { type PropsWithChildren } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DO_TYPING, SEND_MESSAGE } from '../api/messages';
import { noop, pick } from 'lodash';

export type UploadObjectParams = {
  id: string;
  url: string;
  fullUrl: string;
  loading: boolean;
  fileName: string;
  size: number;
  contentType: string;
};

type ContextValueType = {
  newMessage: string;
  uploads: UploadObjectParams[];
  setNewMessage: (val: string) => void;
  onAddUpload: (newUpload: UploadObjectParams) => void;
  onSubmit: () => Promise<void>;
  onTyping: (isTyping: boolean) => void;
  onDeleteUpload: (val: string) => () => void;
  isTyping: boolean;
  onFailedUpload: (id: string) => void;
  onSuccessUpload: (id: string) => void;
};

const defaultValue = {
  newMessage: '',
  uploads: [] as UploadObjectParams[],
  setNewMessage: noop,
  onAddUpload: noop,
  onSubmit: () => Promise.resolve(),
  onTyping: noop,
  onUploadItem: noop,
  onDeleteUpload: (val: string) => noop,
  onFailedUpload: noop,
  onSuccessUpload: noop,
  isTyping: false
};

export const NewMessageContext = React.createContext<ContextValueType>(defaultValue);

interface NewMessageProviderProps extends PropsWithChildren {
  chatId: number;
}

export const NewMessageProvider: React.FC<NewMessageProviderProps> = ({ children, chatId }) => {
  const [newMessage, setNewMessage] = React.useState('');
  const [uploads, setUploads] = React.useState<UploadObjectParams[]>([]);
  const [submitMessage] = useMutation<
    number,
    { chatId: number; content: string; uploads: Partial<UploadObjectParams>[] }
  >(SEND_MESSAGE);
  const [doTyping, { data }] = useLazyQuery<{ DoTyping: boolean }>(DO_TYPING, {
    fetchPolicy: 'network-only'
  });

  const onTyping = (isTyping: boolean) => {
    doTyping({
      variables: {
        chatId,
        isTyping
      }
    });
  };

  const onAddUpload = (newUpload: UploadObjectParams) => {
    setUploads([...uploads, newUpload]);
  };

  const onDeleteUpload = (id: string) => () => {
    setUploads(upls => upls.filter(upl => upl.id !== id));
  };

  const onSubmit = () =>
    submitMessage({
      variables: {
        chatId,
        content: newMessage,
        uploads: uploads.map(upl => pick(upl, ['url', 'contentType', 'size', 'fileName']))
      }
    }).then(() => {
      refresh();
    });

  const refresh = () => {
    setNewMessage('');
    setUploads([]);
  };

  const onSuccessUpload = (id: string) => {
    setUploads(upls => upls.map(upl => (upl.id === id ? { ...upl, loading: false } : upl)));
  };

  const onFailedUpload = (id: string) => {
    setUploads(upls => upls.filter(upl => upl.id !== id));
  };

  React.useEffect(() => {
    refresh();
  }, [chatId]);

  const value = {
    newMessage,
    uploads,
    setNewMessage,
    onAddUpload,
    onSubmit,
    onTyping,
    onDeleteUpload,
    isTyping: Boolean(data?.DoTyping),
    onSuccessUpload,
    onFailedUpload,
    refresh
  };

  return <NewMessageContext.Provider value={value}>{children}</NewMessageContext.Provider>;
};
