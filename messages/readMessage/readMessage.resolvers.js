import client from "../../client";
import { protectedResolver } from "../../users/users.utils";

export default {
  Mutation: {
    readMessage: protectedResolver(async (_, { id }, { loggedInUser }) => {
      const message = await client.message.findFirst({
        where: {
          id,
          userId: {
            not: loggedInUser.id, // 로그인되어있는 사용자가 아닌 경우일 때만 검색
          },
          room: {
            users: {
              some: {
                id: loggedInUser.id, // 로그인 된 유저가 들어가있는 대화방에서 보내진 메세지를 검색
              }, // 오직 나만 읽을 수 있게 한다
            },
          },
        },
      });
      if (!message) {
        return {
          ok: false,
          error: "메세지를 찾을 수 없습니다.",
        };
      }
      await client.message.update({
        where: {
          id,
        },
        data: {
          read: true,
        },
      }); // 읽음으로 표시
      return {
        ok: true,
      };
    }),
  },
};
