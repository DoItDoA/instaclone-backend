import client from "../../client";

const seePhotoResovlers = {
  Query: {
    seePhoto: (_, { id }) =>
      client.photo.findUnique({
        where: { id },
      }),
  },
};

export default seePhotoResovlers;
