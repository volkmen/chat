import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'src/**/*.graphql',
  generates: {
    'src/types/graphql.d.ts': {
      plugins: ['typescript']
    }
  }
};

export default config;
