import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }
  extend type Mutation {
    signIn(
      email: String!
      password: String!
    ): Token!
    signUp(
      email: String!
      currentCity: String!
      hasSocialAuthLogin: Boolean!
      firstName: String
      lastName: String
      displayName: String
      socialAuthId: String
      preferredSocialAuth: SocialAuth
      salt: String
      password: String
      gender: String
      cellphone: String
      dob: Date
    ): Token!
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
    hasSocialAuthLogin: Boolean!
    socialAuthId: String
    preferredSocialAuth: SocialAuth
    email: String!
    salt: String
    gender: String
    cellphone: String
    dob: Date
    currentCity: String!
    createdAt: Date!
    updatedAt: Date!
    documents: [Document]
    homeworks: [Homework]
    lists: [List]
    products: [Product]
    services: [Service]
    questions: [Question]
    setting: Setting
  }
`;