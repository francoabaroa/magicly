import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    settings: [Setting]
    setting (id: ID!): Setting
  }
  type Setting {
    id: ID!
    user: User!
    language: String
    createdAt: Date!
    updatedAt: Date!
  }
`;