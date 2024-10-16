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

export type Account = {
  __typename?: 'Account';
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  is_verified?: Maybe<Scalars['Boolean']['output']>;
  password: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type AddAccountInput = {
  email: Scalars['String']['input'];
  is_verified?: InputMaybe<Scalars['Boolean']['input']>;
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  AddAccount?: Maybe<Account>;
  DeleteAccount: Scalars['ID']['output'];
  UpdateAccount?: Maybe<Account>;
  VerifyEmail?: Maybe<Account>;
};


export type MutationAddAccountArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  username: Scalars['String']['input'];
};


export type MutationDeleteAccountArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateAccountArgs = {
  id: Scalars['Int']['input'];
  username?: InputMaybe<Scalars['String']['input']>;
};


export type MutationVerifyEmailArgs = {
  token?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  GetAccount?: Maybe<Account>;
  GetAccounts?: Maybe<Array<Maybe<Account>>>;
  VerifyEmail?: Maybe<Account>;
};


export type QueryGetAccountArgs = {
  id: Scalars['Int']['input'];
};

export type UpdateAccountInput = {
  UpdateAccount?: InputMaybe<Scalars['String']['input']>;
  is_verified?: InputMaybe<Scalars['Boolean']['input']>;
};
