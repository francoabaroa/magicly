import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    services: [Service]
    service (id: ID!): Service
  }
  type Service {
    id: ID!
    user: User!
    homework: Homework
    name: String
    keywords: [String]
    type: ServiceType
    favorite: Boolean
    ratingScore: Int
    email: String
    phone: String
    cost: Int
    costCurrency: CostCurrency
    createdAt: Date!
    updatedAt: Date!
  }
`;