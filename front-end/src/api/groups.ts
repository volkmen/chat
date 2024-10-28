import { gql } from '@apollo/client';

export const groups = gql(`
	query groups {
    Groups {
      name
      id
    }
  }
`);
