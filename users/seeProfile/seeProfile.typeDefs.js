import { gql } from "apollo-server";

const seeProfileTypeDefs = gql`
  type Query {
    seeProfile(username: String!): User
  }
`;
export default seeProfileTypeDefs;
