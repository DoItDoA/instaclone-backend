import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser }) => {
        const oldphoto = await client.photo.findFirst({
          where: {
            id,
            userId: loggedInUser.id,
          },
          include: {
            hashtags: {
              select: {
                hashtag: true,
              }, // 특정 hashtag 불러온다
            },
          }, // hashtags는 데이터베이스에 없으니 include한다
        });

        if (!oldphoto) {
          return {
            ok: false,
            error: "사진을 찾을 수 없습니다.",
          };
        }
        const photo = await client.photo.update({
          where: { id },
          data: {
            caption,
            hashtags: {
              disconnect: oldphoto.hashtags,
              connectOrCreate: processHashtags(caption),
            }, // 해시태크 수정시 hashtags와 연결 끊고 연결생성해서 수정한 것을 넣는다
          },
        });

      }
    ),
  },
};
