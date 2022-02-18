import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "apollo-server-express";

const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`); // 모든폴더(**)/모든파일(*)에서 ..typeDefs.js로 끝나는 파일 불러옴
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.resolvers.js`); // 표현 {queries,mutations}는 queries.js 또는 mutations.js 끝나는 파일전부다 불러옴. resolvers로 변경

export const typeDefs = mergeTypeDefs(loadedTypes); // 불러온 파일들 하나로 통합.
export const resolvers = mergeResolvers(loadedResolvers);
// apollo server를 이용한 file upload(file: Upload)를 사용하고 싶다면 apollo server가 스키마를 생성해야한다

// const schema = makeExecutableSchema({ typeDefs, resolvers }); // 스키마 생성

// export default schema;
