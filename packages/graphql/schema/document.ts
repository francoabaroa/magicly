import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    documents: [Document]
    document (id: ID!): Document
  }
  extend type Mutation {
    singleUpload(file: Upload!): UploadedFileResponse!
  }
  type Document {
    id: ID!
    name: String!
    type: DocType!
    tag: DocTag
    keywords: [String]
    bucketDocId: String!
    bucketName: String!
    bucketPath: String
    docValue: Int
    notes: String
    createdAt: Date!
    updatedAt: Date!
    user: User!
    homework: Homework
  }
  type UploadedFileResponse {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }
`;