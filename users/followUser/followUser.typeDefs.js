import { gql } from "apollo-server";

const followUserTypeDef = gql`
  type FollowUserResult {
    ok: Boolean!
    error: String
  }

  type Mutation {
    followUser(username: String!): FollowUserResult
  }
`;

export default followUserTypeDef;
