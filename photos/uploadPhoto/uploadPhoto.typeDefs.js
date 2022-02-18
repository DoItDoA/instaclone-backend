import { gql } from "apollo-server";

const uploadPhotoTypeDefs = gql`
  type Mutation {
    uploadPhoto(file: Upload!, caption: String): Photo!
  }
`;

export default uploadPhotoTypeDefs;
