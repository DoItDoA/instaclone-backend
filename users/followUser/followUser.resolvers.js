import client from "../../client";
import { protectedResolver } from "../users.utils";

const followUserResolvers = async (_, { username }, { loggedInUser }) => {
  const ok = await client.user.findUnique({ where: { username } });
  if (!ok) {
    return {
      ok: false,
      error: "팔로우에 실패했습니다.",
    };
  }

  await client.user.update({
    where: {
      id: loggedInUser.id,
    },
    data: {
      following: {
        connect: {
          username,
        }, // connect는 내가 대상유저(username) 입력시 연결해준다
      }, // 데이터베이스 following 컬럼에서 작용
    },
  });
  return {
    ok: true,
  };
};

export default {
  Mutation: {
    followUser: protectedResolver(followUserResolvers),
  },
};
