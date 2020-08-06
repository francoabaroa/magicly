import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    homeworks: [Homework]
    homework (id: ID!): Homework
  }
  extend type Mutation {
    createHomework(title: String!, status: Status!, cost: Int!, executionDate: Date!, executor: String!): Homework!
    deleteHomework(id: ID!): Boolean!
  }
  type Homework {
    id: ID!
    user: User!
    title: String!
    type: HomeworkType
    keywords: [String]
    status: Status!
    cost: Int!
    costCurrency: CostCurrency
    notes: String
    executionDate: Date!
    executor: String!
    createdAt: Date!
    updatedAt: Date!
  }
`;