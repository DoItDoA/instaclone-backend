import client from "../../client";
import { protectedResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";
import { uploadToS3 } from "../../shared/shared.utils";

const uploadPhotoResolvers = async (_, { file, caption }, { loggedInUser }) => {
  let hashtagObjs = [];
  if (caption) {
    hashtagObjs = processHashtags(caption);
  }

  const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads");
  return client.photo.create({
    data: {
      file: fileUrl,
      caption,
      user: {
        connect: {
          id: loggedInUser.id,
        },
      },
      ...(hashtagObjs.length > 0 && {
        hashtags: {
          connectOrCreate: hashtagObjs, // connectOrCreate는 where에서 찾아보고 있으면 연결하고 없으면 create에서 만든다
        },
      }),
    },
  });
};

export default {
  Mutation: {
    uploadPhoto: protectedResolver(uploadPhotoResolvers),
  },
};
