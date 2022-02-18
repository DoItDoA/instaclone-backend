import { gql } from "apollo-server";

const seeFollowersTypeDefs = gql`
  type seeFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
    totalPages: Int
  }
  type Query {
    seeFollowers(username: String!, page: Int!): seeFollowersResult!
  }
`;

export default seeFollowersTypeDefs;
