import client from "../../client";
import { protectedResolver } from "../users.utils";

const unfollowUserResolvers = async (_, { username }, { loggedInUser }) => {
  const ok = await client.user.findUnique({ where: { username } });
  if (!ok) {
    return {
      ok: false,
      error: "언팔로우를 실패했습니다.",
    };
  }
  await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      following: {
        disconnect: {
          username,
        },
      },
    },
  });
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    unfollowUser: protectedResolver(unfollowUserResolvers),
  },
};
