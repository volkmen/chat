import { gql } from '@apollo/client';

export const users = gql(`
	query GetUsers {
    GetUsers {
    	id
      username
      email
    }
  }
`);
