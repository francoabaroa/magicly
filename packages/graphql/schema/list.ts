import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    lists(listTypes: [ListType], cursor: String, limit: Int): ListConnection!
    list (id: ID!): List
  }
  extend type Mutation {
    createList(
      name: String,
      type: ListType!
    ): List!
    createListWithItems(
      name: String,
      type: ListType!
      preSaveListItems: [PreSaveListItem],
    ): List!
    updateListWithItems(
      id: ID!
      name: String,
      type: ListType!
      preSaveListItems: [PreSaveListItem],
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
  input PreSaveListItem {
    name: String!
    type: ItemType!
    complete: Boolean
    notes: String
    id: ID
  }
`;