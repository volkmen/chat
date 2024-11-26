import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query GetMe {
    GetMe {
      id
      username
      is_verified
      email
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($email: String!, $password: String!) {
    SignIn(email: $email, password: $password) {
      is_verified
      email
      username
      jwtToken
    }
  }
`;

export const SIGN_UP = gql`
  mutation SignUp($username: String!, $email: String!, $password: String!) {
    SignUp(username: $username, email: $email, password: $password) {
      id
      username
      email
      jwtToken
    }
  }
`;

export const VERIFY_EMAIL = gql`
  mutation VerifyEmail($token: Int!) {
    VerifyEmail(token: $token) {
      is_verified
      id
    }
  }
`;

export const RESEND_VERIFICATION_TOKEN = gql`
  query ResendVerificationToken {
    ResendVerificationToken
  }
`;
