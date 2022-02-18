import client from "../../client";

const searchUsersResolvers = {
  Query: {
    searchUsers: (_, { keyword }) =>
      client.user.findMany({
        where: {
          username: {
            startsWith: keyword.toLowerCase(), // 해당 유저네임 철자 시작으로 찾음
          },
        },
      }),
  },
};

export default searchUsersResolvers;
