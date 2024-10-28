import { gql } from '@apollo/client';

export const users = gql(`
	query users {
    Users {
    	id
      username
      email
    }
  }
`);
