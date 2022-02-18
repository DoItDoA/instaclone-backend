import client from "../client";

const usersResolvers = {
  User: {
    totalFollowing: ({ id }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        }, // followers 중에서 내 id를 갖고 있는 사람의 수를 센다
      }), // root(첫번째인자)는 User를 가리킨다. 내가 id:1을 찾을 시 DB에서 id=1인 USER정보 다가져오고 totalFollowing과 totalFollowers는 DB에 없으므로 root로 User정보를 준다

    totalFollowers: ({ id }) =>
      client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      }),

    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }
      return id === loggedInUser.id;
    },

    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      // 방법 1
      const exists = await client.user
        .findUnique({ where: { username: loggedInUser.username } })
        .following({
          where: {
            id,
          },
        });

      /* 방법2
      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
    */
      return exists.length !== 0;
      // return Boolean(exists);
    },

    photos: ({ id }) => client.user.findUnique({ where: { id } }).photos(),
  }, // Query, Mutation을 사용하여 DB와 상호작용 안하고 User를 써서 바로 사용
};

export default usersResolvers;
