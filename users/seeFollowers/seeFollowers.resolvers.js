import client from "../../client";

const seeFollowersResolvers = {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (!ok) {
        return {
          ok: false,
          error: "유저를 찾지 못했습니다.",
        };
      }

      const followers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: 5, // skip한 뒤 팔로워 5개를 읽는다
          skip: (page - 1) * 5, // 10이면 index 0~9까지 제외하고 take하게 한다
        }); // user를 찾고난 다음에 팔로워를 실행하게 해준다
      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } }, // following 컬럼에서 username 1명 또는 그이상을 찾아 수를 센다
      });

      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
      /* 타입 B의 팔로워 찾는 방법
        const bFollowers = await client.user.findMany({
          where: {
            following: {
              some: {
                username,
              },
            },
          },
        });
        console.log(`bFollowers`, bFollowers.length);
    */
    },
  },
};

export default seeFollowersResolvers;
