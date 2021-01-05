import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    answers: [Answer]
    answer (id: ID!): Answer
  }
  extend type Mutation {
    createAnswer(
      answerBody: String!,
      questionStatus: QuestionStatus!
      questionId: ID!,
      userId: ID!,
      employeeId: ID!,
    ): Answer!
    deleteAnswer(id: ID!): Boolean!
  }
  type Answer {
    id: ID!
    body: String!
    keywords: [String]
    createdAt: Date!
    updatedAt: Date!
    employee: Employee!
    question: Question!
    attachment: [Attachment]
  }
`;