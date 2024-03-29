import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    listItems (
      listType: ListType!,
      excludeComplete: Boolean,
      cursor: String,
      limit: Int
    ): ListItemConnection!
    recentRecommendations (
      listType: ListType,
      excludeComplete: Boolean,
      cursor: String,
      limit: Int
    ): ListItemConnection!
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
      executionDate: Date
      executor: String
    ): ListItem!
    completeListItem(
      id: ID!
      complete: Boolean!
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
  type ListItemConnection {
    edges: [ListItem]
    pageInfo: PageInfo!
  }
`;