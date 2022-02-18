import { createWriteStream } from "fs"; // 기본적으로 nodejs에 있다
import client from "../../client";
import bcrypt from "bcrypt";
import { protectedResolver } from "../users.utils";
import { uploadToS3 } from "../../shared/shared.utils";

const editProfileMutations = async (
  _,
  { firstName, lastName, username, email, password: newPassword, bio, avatar },
  { loggedInUser } //  ApolloServer의 context로부터 가져옴
) => {
  let avatarUrl = null;
  if (avatar) {
    avatarUrl = await uploadToS3(avatar, loggedInUser.id, "avatars");
    /* 내부 서버에 이미지 저장
    const { filename, createReadStream } = await avatar;
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`; // 파일명 유니크하게 하기위해 id+now+파일명
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      process.cwd() + "/uploads/" + newFilename
    ); // 현재 작업경로(process.cwd()) ,
    readStream.pipe(writeStream);
    avatarUrl = `http://localhost:4000/static/${newFilename}`; // express.static로 접근가능해졌다. 나중에 aws로 변경 
    */
  }
  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  } // 바꿀 비밀번호 해쉬처리

  const updatedUser = await client.user.update({
    where: { id: loggedInUser.id },
    data: {
      firstName, // 값을 안 넣어도 undefined 처리안하고 그대로 둔다
      lastName,
      username,
      email,
      bio,
      ...(uglyPassword && { password: uglyPassword }), // uglyPassword가 존재하면 ...을 통해 {}가 없어져 password: uglyPassword가 된다
      ...(avatarUrl && { avatar: avatarUrl }),
    },
  });
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      error: "프로필 업데이트를 실패했습니다.",
    };
  }
};

export default {
  Mutation: {
    editProfile: protectedResolver(editProfileMutations),
  }, // protectedResolver의 ourResolver인자에 함수넣고, ourResolver함수 호출
};
