export type ApolloResponse<K extends keyof any, T> = {
  data: ApolloSuccessDataResponse<K, T>;
};

export type ApolloSuccessDataResponse<K extends keyof any, T> = {
  [P in K]: T;
};
