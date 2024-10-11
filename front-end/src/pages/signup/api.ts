import { gql } from '@apollo/client';

export const SIGN_UP = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    signUp(input: { username: $username, email: $email, password: $password }) {
      user {
        id
        username
        email
      }
      token
    }
  }
`;
