require("dotenv").config(); // env 파일 불러오기 설정
import http from "http";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import logger from "morgan";
import { typeDefs, resolvers } from "./schema";
import { getUser } from "./users/users.utils";

const apollo = new ApolloServer({
  typeDefs,
  resolvers, // 파일 업로드를 위해 schema 지우고 둘 다 직접 호출
  context: async (ctx) => {
    if (ctx.req) {
      // 웹소켓은 request랑 response가 없다
      return {
        loggedInUser: await getUser(ctx.req.headers.token), // localhost의 http headers에 토큰값 넣고 request header로부터 token값 가져옴
      };
    } else {
      // 웹소켓으로 리스닝할 시
      const {
        connection: { context },
      } = ctx; // 밑의 subscriptions 리턴값을 가져온다
      return {
        loggedInUser: context.loggedInUser,
      };
    }
  }, // context는 모든 resolver의 3번째 인자에서 접근 가능한 정보를 넣을 수 있는 object이다
  subscriptions: {
    onConnect: async ({ token }) => {
      if (!token) {
        throw new Error("리스닝을 할 수 없습니다.");
      }
      const loggedInUser = await getUser(token);
      return {
        loggedInUser,
      };
    },
  }, // token은 http와 관련이 있으므로 웹소켓에서는 어떤 인증도 하지 않는다. subscriptions하고 onConnect로 연결하여 웹소켓에서도 인증하게 한다
});
const PORT = process.env.PORT; // .env에서 파일 불러오기

const app = express(); // express 서버 생성
apollo.applyMiddleware({ app }); // apollo server에 middleware 적용. 즉 apollo와 express가 함께한다
app.use(logger("dev"));
app.use("/static", express.static("uploads")); // url에 '/static/uploads의 파일명' 입력시 브라우저가 uploads 폴더에 있는 내용을 보여주게한다.

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer); // subscription에 대한 정보를, 다시말해 웹소켓에 대한 정보를 설치

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/`);
});
