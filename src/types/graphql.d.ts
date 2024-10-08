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

export type Car = {
  __typename?: 'Car';
  model: Scalars['String']['output'];
  productionYear: Scalars['Int']['output'];
  series: Scalars['String']['output'];
};

export type Query = {
  __typename?: 'Query';
  GetCar?: Maybe<Car>;
  GetCars?: Maybe<Array<Maybe<Car>>>;
  GetUser?: Maybe<User>;
  GetUsers?: Maybe<Array<Maybe<User>>>;
};


export type QueryGetCarArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetUserArgs = {
  id: Scalars['Int']['input'];
};

export type User = {
  __typename?: 'User';
  age?: Maybe<Scalars['Int']['output']>;
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};
