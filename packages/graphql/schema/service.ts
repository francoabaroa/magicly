import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    services(cursor: String, limit: Int): ServiceConnection!
    service (id: ID!): Service
  }
  extend type Mutation {
    saveService(
      name: String!,
      type: ServiceType!
      favorite: Boolean
      url: String
    ): Service!
    favoriteService(
      id: ID!
      favorite: Boolean!
      ): Service!
    deleteService(id: ID!): Boolean!
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
    url: String
    createdAt: Date!
    updatedAt: Date!
    user: User!
    homework: Homework
  }
  type ServiceConnection {
    edges: [Service]!
    pageInfo: PageInfo!
  }
`;