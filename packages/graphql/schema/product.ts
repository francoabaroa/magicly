import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    products: [Product]
    product (id: ID!): Product
  }
  type Product {
    id: ID!
    name: String!
    type: ProductType!
    keywords: [String]
    favorite: Boolean
    ratingScore: Int
    cost: Int
    costCurrency: CostCurrency
    url: String
    createdAt: Date!
    updatedAt: Date!
    user: User!
  }
`;