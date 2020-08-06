import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }
  extend type Mutation {
    signUp(
      displayName: String!
      email: String!
      hash: String!
    ): Token!
    signIn(login: String!, hash: String!): Token!
    updateUser(displayName: String!): User!
    deleteUser(id: ID!): Boolean!
  }
  type Token {
    token: String!
  }
  type User {
    id: ID!
    firstName: String
    lastName: String
    displayName: String
    socialAuthLogin: Boolean
    socialAuthId: String
    preferredSocialAuth: SocialAuth
    email: String!
    salt: String
    hash: String
    gender: String
    cellphone: String
    dob: Date
    currentCity: String!
    createdAt: Date!
    updatedAt: Date!
  }
`;