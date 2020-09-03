import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    documents(
      docTypes: [DocType],
      cursor: String,
      limit: Int
    ): DocumentConnection!
    document (id: ID!): Document
    getDocumentAndUrl(
      id: ID!
    ): DocumentUrl
  }
  extend type Mutation {
    addDocument(
      file: Upload!
      name: String!
      type: DocType!
      keywords: [String]
      notes: String
      ): UploadedFileResponse!
    deleteDocument(id: ID!): Boolean!
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
  type DocumentUrl {
    url: String
    document: Document
  }
  type UploadedFileResponse {
    filename: String!
    mimetype: String!
    encoding: String!
    url: String!
  }
  type DocumentConnection {
    edges: [Document]!
    pageInfo: PageInfo!
  }
`;