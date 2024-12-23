import { FieldPolicy, Reference } from '@apollo/client';

export function concatPagination<T = Reference>(keyArgs: any = false): FieldPolicy<T[]> {
  return {
    keyArgs,
    merge(existing, incoming) {
      return existing ? [...existing, ...incoming] : incoming;
    }
  };
}
