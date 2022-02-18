import jwt from "jsonwebtoken";
import client from "../client";

// 토큰으로 유저 id 불러와 유저 정보 호출
export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const { id } = await jwt.verify(token, process.env.SECRET_KEY); // 토큰을 해독하여 토큰으로 변하기전 값(id)으로 반환
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

// 로그인 유무 확인
export const protectedResolver =
  (ourResolver) => (root, args, context, info) => {
    if (!context.loggedInUser) {
      // Query는 protectedResolver를 사용 안하는데 seeFeed만 예외로 사용한다. seeFeed는 반환이 배열이므로 ok:,error:로 반환하면 안된다
      const query = info.operation.operation === "query"; // 네번째인자 info안에 사용한 쿼리문이 query인지 mutation인지 구분하는 것이 있다.
      if (query) {
        return null;
      } else {
        return {
          ok: false,
          error: "로그인 해주세요.",
        };
      }
    }
    return ourResolver(root, args, context, info); // ourResolver가 입력 인자이면서 함수명
  };
/*
const a = protectedResolver("b"); // protectedResolver의 반환값은 함수이다. "b"는 resolver에 넣음
const b = a("c", "d", "e", "f"); // a가 함수여서 인자들 값 넣음

const c = doubleF("b")("c", "d", "e", "f"); // 위 2개를 줄여서 이렇게 표현
*/
