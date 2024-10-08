const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');
const { print } = require('graphql');
const path = require('path');
const fs = require('fs');

const loadedFiles = loadFilesSync(path.join(__dirname, 'src/resolvers'), {
  extensions: ['.graphql']
});
const typeDefs = mergeTypeDefs(loadedFiles);
const printedTypeDefs = print(typeDefs);

fs.writeFileSync('src/schema.graphql', printedTypeDefs);
