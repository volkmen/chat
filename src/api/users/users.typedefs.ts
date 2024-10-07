const userTypeDefs = `
    type User {
        firstName: String!
        lastName: String!
        age: Int
    }
    
    type Query {
        GetUsers: [User]
        GetUser(id: Int!): User
    }
`;

export default userTypeDefs;
