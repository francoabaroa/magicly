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
      isUserAnswer: Boolean,
      userId: ID!,
      employeeId: ID,
    ): Answer!
    deleteAnswer(id: ID!): Boolean!
  }
  type Answer {
    id: ID!
    body: String!
    keywords: [String]
    isUserAnswer: Boolean
    createdAt: Date!
    updatedAt: Date!
    employee: Employee
    question: Question!
    attachments: [Attachment]
  }
`;