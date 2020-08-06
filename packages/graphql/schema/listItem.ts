import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    listItems: [ListItem]
    listItem (id: ID!): ListItem
  }
  type ListItem {
    id: ID!
    list: List!
    name: String!
    keywords: [String]
    complete: Boolean
    favorite: Boolean
    quantity: Int!
    type: ItemType
    executionDate: Date!
    createdAt: Date!
    updatedAt: Date!
  }
`;