import client from "../../client";

const seeProfileResolvers = {
  Query: {
    seeProfile: (_, { username }) =>
      client.user.findUnique({
        where: {
          username,
        },
        include: {
          following: true, // 내가 팔로잉 중인 사용자들만 include 하라고 표시
          followers: true,
        }, // include는 내가 원하는 사용자 관계를 가져온다
      }), // findUnique는 오로지 unique한 필드만 찾는다
  },
};
export default seeProfileResolvers;
