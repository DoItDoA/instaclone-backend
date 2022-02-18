import { gql } from "apollo-server";

const searchUsersTypeDefs = gql`
  type Query {
    searchUsers(keyword: String!): [User]!
  }
`;

export default searchUsersTypeDefs;
