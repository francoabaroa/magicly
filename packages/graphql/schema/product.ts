import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    products: [Product]
    product (id: ID!): Product
  }
  type Product {
    id: ID!
    user: User!
    name: String
    keywords: [String]
    type: ProductType
    favorite: Boolean
    ratingScore: Int
    cost: Int
    costCurrency: CostCurrency
    createdAt: Date!
    updatedAt: Date!
  }
`;