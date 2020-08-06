import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    lists: [List]
    list (id: ID!): List
  }
  type List {
    id: ID!
    user: User!
    name: String
    type: ListType!
    createdAt: Date!
    updatedAt: Date!
  }
`;