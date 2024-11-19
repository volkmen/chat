export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Chat = {
  __typename?: 'Chat';
  id: Scalars['ID']['output'];
  is_group: Scalars['Boolean']['output'];
  messages: Array<Message>;
};

export type Message = {
  __typename?: 'Message';
  content: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_read: Scalars['Boolean']['output'];
  updated_at: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  AddChat: Scalars['ID']['output'];
  SignIn?: Maybe<User>;
  SignUp?: Maybe<User>;
  UpdateMe?: Maybe<User>;
  VerifyEmail?: Maybe<User>;
};


export type MutationAddChatArgs = {
  pbKey: Scalars['String']['input'];
  receiverId: Scalars['ID']['input'];
};


export type MutationSignInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationSignUpArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationUpdateMeArgs = {
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['Int']['input'];
};

export type Query = {
  __typename?: 'Query';
  DeleteMe: Scalars['ID']['output'];
  GetChatPbKey: Scalars['String']['output'];
  GetChats: Array<Chat>;
  GetMe: User;
  GetUsers: Array<User>;
  ResendVerificationToken: Scalars['ID']['output'];
  ResetPassword: Scalars['ID']['output'];
};

export type User = {
  __typename?: 'User';
  chats?: Maybe<Array<Maybe<Chat>>>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_verified?: Maybe<Scalars['Boolean']['output']>;
  jwtToken?: Maybe<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  username: Scalars['String']['output'];
};
