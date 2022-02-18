import { gql } from "apollo-server-core";

const loginTypeDefs = gql`
  type LoginResult {
    ok: Boolean!
    token: String
    error: String
  }

  type Mutation {
    login(username: String!, password: String!): LoginResult!
  }
`;
export default loginTypeDefs;
