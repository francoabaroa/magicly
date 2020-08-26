import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    lists(cursor: String, limit: Int): ListConnection!
    list (id: ID!): List
  }
  extend type Mutation {
    createList(
      name: String,
      type: ListType!
    ): List!
    deleteList(id: ID!): Boolean!
  }
  type List {
    id: ID!
    name: String
    type: ListType!
    createdAt: Date!
    updatedAt: Date!
    user: User!
    listItems: [ListItem]
  }
  type ListConnection {
    edges: [List]!
    pageInfo: PageInfo!
  }
`;