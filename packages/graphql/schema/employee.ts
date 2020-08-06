import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    employees: [Employee]
    employee (id: ID!): Employee
  }
  type Employee {
    id: ID!
    firstName: String!
    lastName: String!
    displayName: String!
    createdAt: Date!
    updatedAt: Date!
  }
`;