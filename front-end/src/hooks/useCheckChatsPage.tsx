import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CHATS } from '../api/chats';
import { useNavigate, useParams } from 'react-router-dom';
import { GetChatsResponse } from '../types/chats';
import { PageRoutes } from '../consts/routes';

export default function useCheckChatsPage() {
  const { data, loading } = useQuery<GetChatsResponse>(GET_CHATS);
  const params = useParams();
  const chatId = params.chatId && +params.chatId;
  const navigate = useNavigate();

  const shouldBeRerendered = !loading && data?.GetChats && data.GetChats.findIndex(c => +c.id === chatId) === -1;

  React.useEffect(() => {
    if (shouldBeRerendered) {
      navigate(PageRoutes.Home);
    }
  }, [shouldBeRerendered]);
}
