import client from "../client";

export default {
  Room: {
    users: ({ id }) => client.room.findUnique({ where: { id } }).users(), // 만약 대화방 사람이 3000명처럼 많으면 이렇게 작성하면 데이터베이스 폭발한다
    messages: ({ id }) =>
      client.message.findMany({
        where: {
          roomId: id,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
    unreadTotal: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return 0;
      } // 만약 로그인하지 않은 유저가 읽을 경우
      return client.message.count({
        // 단체방에서 읽음 숫자
        where: {
          read: false, // 아직 안읽었고
          roomId: id, // 내가 방에 들어오고
          user: {
            id: {
              not: loggedInUser.id, //내가 생성한 메세지가 아니다
            },
          },
        },
      });
    },
  },
  Message: {
    user: ({ id }) => client.message.findUnique({ where: { id } }).user(),
  },
};
