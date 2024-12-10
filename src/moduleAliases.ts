import moduleAlias from 'module-alias';
import path from 'node:path';

moduleAlias.addAliases({
  resolvers: path.resolve(__dirname, 'resolvers'),
  entities: path.resolve(__dirname, 'entities'),
  types: path.resolve(__dirname, 'types'),
  utils: path.resolve(__dirname, 'utils'),
  consts: path.resolve(__dirname, 'consts')
});
