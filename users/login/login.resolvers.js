import client from "../../client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginResolvers = {
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return {
          ok: false,
          error: "유저이름이 없습니다.",
        };
      }

      const passwordOk = await bcrypt.compare(password, user.password); // 입력된 패스워드와 해쉬처리된 패스워드 비교
      if (!passwordOk) {
        return {
          ok: false,
          error: "비밀번호가 틀렸습니다.",
        };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      /* jwt.sign(payload, secretOrPrivateKey, [options, callback])
        payload는 우리가 토큰에 넣게 되는 것이고 토큰은 아무나 볼수 있다. secretOrPrivateKey는 서버가 서명한다
        사인하여 토큰을 발행한다 토큰이 돌아오면, 그 토큰이 우리가 발행한게 맞는지 확인
      */
      return {
        ok: true,
        token,
      };
    },
  },
};

export default loginResolvers;
