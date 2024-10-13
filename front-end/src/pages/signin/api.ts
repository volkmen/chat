import { gql } from '@apollo/client';

export const SIGN_IN = gql`
  mutation SignIn($username: String!, $password: String!) {
    signIn(input: { username: $username, password: $password }) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;
