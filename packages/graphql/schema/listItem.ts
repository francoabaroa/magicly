import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    listItems: [ListItem]
    listItem (id: ID!): ListItem
  }
  extend type Mutation {
    createListItem(
      name: String!
      type: ItemType!
      listType: ListType!
      notes: String
      keywords: [String]
      notificationType: NotificationType
      complete: Boolean
      favorite: Boolean
      quantity: Int
      notes: String
      executionDate: Date
      executor: String
    ): ListItem!
    deleteListItem(id: ID!): Boolean!
  }
  type ListItem {
    id: ID!
    name: String!
    type: ItemType!
    keywords: [String]
    notificationType: NotificationType
    complete: Boolean
    favorite: Boolean
    quantity: Int
    notes: String
    executionDate: Date
    executor: String
    createdAt: Date!
    updatedAt: Date!
    list: List!
  }
`;