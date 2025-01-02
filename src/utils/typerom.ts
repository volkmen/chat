import { SelectQueryBuilder } from 'typeorm/query-builder/SelectQueryBuilder';

type SelectQueryBuilderWithCondition<T> = SelectQueryBuilder<T> & {
  addSelectConditioned?: (property, key, condition) => SelectQueryBuilderWithCondition<T>;
};

export function addSelectConditioned<T = any>(queryBuilder: SelectQueryBuilder<T>): SelectQueryBuilderWithCondition<T> {
  return Object.assign(queryBuilder, {
    addSelectConditioned(property, key, condition = true) {
      if (condition) {
        queryBuilder.addSelect(property, key);
      }
      return queryBuilder;
    }
  });
}

export function createCacheTagsToRemove(baseKey: string) {
  return [baseKey, `${baseKey}-pagination`, `${baseKey}-count`];
}
