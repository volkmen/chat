// import { buildHTTPExecutor } from '@graphql-tools/executor-http';
// import App from '../server';
// import { parse } from 'graphql/index';
//
// export function getExecutor(app: App, jwtToken?: string) {
//   const addFields = jwtToken
//     ? {
//         headers: {
//           Authorization: `Bearer ${jwtToken}`
//         }
//       }
//     : {};
//
//   return buildHTTPExecutor({
//     fetch: app.yoga.fetch,
//     endpoint: `/graphiql`,
//     ...addFields
//   });
// }
// export const mockUser = {
//   email: 'email.gmail.com',
//   username: 'John',
//   password: 'Qwerty123!'
// };
//
// export async function insertRandomUser(executor, user = mockUser) {
//   return executor({
//     document: parse(/* GraphQL */ `
//       mutation SignUp {
//         SignUp(username: "${user.username}", email: "${user.email}", password: "${mockUser.password}") {
//             username
//             is_verified
//             jwtToken
//             id
//         }
//       }
// 		`),
//     operationName: 'SignUp'
//   });
// }
