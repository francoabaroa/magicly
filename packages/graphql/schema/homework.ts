import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    homeworks(cursor: String, limit: Int): HomeworkConnection!
    homework (id: ID!): Homework
  }
  extend type Mutation {
    createHomework(
      title: String!
      status: Status!
      type: HomeworkType!
      notificationType: NotificationType!
      keywords: [String]
      cost: Int
      costCurrency: CostCurrency
      notes: String
      executionDate: Date
      executor: String
    ): Homework!
    deleteHomework(id: ID!): Boolean!
  }
  type Homework {
    id: ID!
    title: String!
    type: HomeworkType!
    keywords: [String]
    status: Status!
    notificationType: NotificationType!
    cost: Int
    costCurrency: CostCurrency
    notes: String
    executionDate: Date
    executor: String
    createdAt: Date!
    updatedAt: Date!
    user: User!
    documents: [Document]
    services: [Service]
  }
  type HomeworkConnection {
    edges: [Homework]!
    pageInfo: PageInfo!
  }
  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }
`;