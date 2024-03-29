import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    questions(questionStatus: [QuestionStatus], cursor: String, limit: Int): QuestionConnection!
    question (id: ID!): Question
  }
  extend type Mutation {
    createQuestion(
      body: String!,
      type: QuestionType!
      urgent: Boolean,
      notificationType: NotificationType!
    ): Question!
    deleteQuestion(id: ID!): Boolean!
  }
  type Question {
    id: ID!
    body: String!
    type: QuestionType!
    keywords: [String]
    status: QuestionStatus!
    notificationType: NotificationType!
    answers: [Answer]
    attachments: [Attachment]
    urgent: Boolean
    createdAt: Date!
    updatedAt: Date!
    user: User!
  }
  type QuestionConnection {
    edges: [Question]!
    pageInfo: PageInfo!
  }
`;