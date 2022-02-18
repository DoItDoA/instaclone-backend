import { gql } from "apollo-server";

const seePhotoTypeDefs = gql`
  type Query {
    seePhoto(id: Int!): Photo!
  }
`;

export default seePhotoTypeDefs;
