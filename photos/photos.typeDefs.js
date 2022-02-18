import { gql } from "apollo-server";

const photosTypeDefs = gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    hashtags: [Hashtag]
    likes: Int!
    isMine: Boolean!
    isLiked: Boolean!
    commentNumber: Int!
    comments: [Comment]
    createdAt: String!
    updatedAt: String!
  }
  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int!
    createdAt: String!
    updatedAt: String!
  }
  type Like {
    id: Int!
    photo: Photo!
    createdAt: String!
    updatedAt: String!
  }
`;
// Like에서 굳이 prisma와 똑같이 맞출 필요가 없다(user가 없음)
export default photosTypeDefs;
