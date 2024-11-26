import { gql } from '@apollo/client';

export const GET_USERS = gql(`
	query GetUsers {
    GetUsers {
    	id
      username
      email
    }
  }
`);

export const GET_USERS_CHATS = gql(`
	query GetUsersChats {
    GetUsers {
    	id
      username
      email
    }
    GetChats {
      id
      correspondent {
        id
        username
      }
    }
  }
`);
