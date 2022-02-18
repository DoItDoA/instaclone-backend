import client from "../../client";
import bcrypt from "bcrypt";

const createAccountResolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password }
    ) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        }); // findFirst는 기본적으로 조건(filter)에 맞는 첫번째 사용자를 리턴, 중복된 username과 email 찾음

        if (existingUser) {
          throw new Error("이 유저이름과 비밀번호는 이미 존재합니다.");
        }

        const uglyPassword = await bcrypt.hash(password, 10); // 비밀번호를 해쉬처리하여 복잡하게 함, 두번째 인자는 salt이며 10번정도 좀 더 꼬아서 변경

        await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          error: "계정 생성에 실패했습니다.",
        };
      }
    },
  },
};

export default createAccountResolvers;
