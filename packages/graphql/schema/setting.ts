import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    settings: [Setting]
    setting (id: ID!): Setting
  }
  extend type Mutation {
    updateSetting(
      firstName: String!,
      currentCity: String!
      email: String!
      languageIso2: LanguageIso2!
      defaultNotificationType: DefaultNotificationType!
    ): UserSetting!
  }
  type UserSetting {
    user: User!
    setting: Setting!
  }
  type Setting {
    id: ID!
    languageIso2: LanguageIso2!
    defaultNotificationType: DefaultNotificationType!
    createdAt: Date!
    updatedAt: Date!
    user: User!
  }
`;