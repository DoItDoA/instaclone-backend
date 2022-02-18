import { gql } from "apollo-server";

const unfollowUserTypeDef = gql`
  type unfollowUserResult {
    ok: Boolean!
    error: String
  }
  type Mutation {
    unfollowUser(username: String!): unfollowUserResult
  }
`;

export default unfollowUserTypeDef;
