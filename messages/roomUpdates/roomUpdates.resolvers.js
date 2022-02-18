import { withFilter } from "graphql-subscriptions";
import client from "../../client";
import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";

export default {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        // roomUpdates.roomId와 id가 일치 안할 경우, 계속 listening 뜨는 것을 방지하기위함, listening 전 체크
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: {
              some: {
                id: context.loggedInUser.id,
              },
            },
          }, // 로그인한 유저와 roomUpdates id 입력값 둘다 필터링
          select: {
            id: true,
          },
        });
        if (!room) {
          throw new Error("확인할 수 없습니다."); // Error나 null이 리턴될 수 있어 typeDefs에서 Message 리턴이 Required가 아니다
        }
        // listening 후 체크
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE), // subscribe함수를 이용하여 asyncIterator리턴하여 trigger들을 listen한다
          async (
            { roomUpdates } /*sendMessage의 message*/,
            { id } /*typeDefs의 입력 id*/,
            { loggedInUser }
          ) => {
            if (roomUpdates.roomId === id) {
              const room = await client.room.findFirst({
                where: {
                  id,
                  users: {
                    some: {
                      id: loggedInUser.id,
                    },
                  },
                },
                select: {
                  id: true,
                },
              });
              if (!room) {
                return false;
              }
              return true;
            }
          } // NEW_MESSAGE를 subscribe 중이고 필터는 true가 반환되면 그 이벤트를 sendMessage에서 pulish한다
        )(root, args, context, info); // subscribe가 바로 withFilter함수를 호출해야한다 [ subscribe:withFilter() ] 처럼 , protectedResolover랑 형태가 같다
      },
    },
  },
};
