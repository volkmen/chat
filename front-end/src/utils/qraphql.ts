export function mergeQueries(queries: any[]) {
  // Extract the field definitions and ensure proper formatting
  const mergedFields = queries
    .map(query =>
      query
        .replace(/query\s+[^(]+\(([^)]+)\)\s*{/, '')
        .replace(/}$/, '')
        .trim()
    )
    .join('\n');

  // Extract the variables declaration from the first query
  const variableDeclarationMatch = queries[0].match(/\(([^)]+)\)/);
  const variables = variableDeclarationMatch ? variableDeclarationMatch[1] : '';

  // Create the merged query string
  return `
    query MergedQuery(${variables}) {
      ${mergedFields}
    }
  `;
}
