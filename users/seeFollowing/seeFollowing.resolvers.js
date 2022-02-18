import client from "../../client";

const seeFollowingResolvers = {
  Query: {
    seeFollowing: async (_, { username, lastId }) => {
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

      const following = await client.user
        .findUnique({ where: { username } })
        .following({
          take: 5,
          skip: lastId ? 1 : 0, // 1이면 마지막 대상 제외하고 다음 대상들을 출력, 0이면 마지막 대상도 함께 출력
          ...(lastId && { cursor: { id: lastId } }), // cursor는 리스트의 마지막 대상기준으로 그 다음 대상들을 출력시킨다
        });
      return {
        ok: true,
        following,
      };
    },
  },
};

export default seeFollowingResolvers;
