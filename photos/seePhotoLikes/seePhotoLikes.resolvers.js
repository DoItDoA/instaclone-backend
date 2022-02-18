import client from "../../client";

export default {
  Query: {
    seePhotoLikes: async (_, { id }) => {
      const likes = await client.like.findMany({
        where: {
          photoId: id,
        },
        select: {
          user: true,
        },
      });
      return likes.map((like) => like.user); // likes만 반환하면 object이기 때문에 읽을 수가 없어 배열을 하나씩 반환해야 읽을 수 있다.
    },
  },
};
