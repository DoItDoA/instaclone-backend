import { gql } from "apollo-server";

export default gql`
  type Subscription {
    roomUpdates(id: Int!): Message
  }
`; // Query와 Mutation처럼 기능사용
