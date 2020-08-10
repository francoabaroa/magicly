import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    services: [Service]
    service (id: ID!): Service
  }
  type Service {
    id: ID!
    name: String!
    type: ServiceType!
    keywords: [String]
    favorite: Boolean
    ratingScore: Int
    email: String
    phone: String
    cost: Int
    costCurrency: CostCurrency
    createdAt: Date!
    updatedAt: Date!
    user: User!
    homework: Homework
  }
`;