import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";
import { existUser } from "@/services/user";

const handler = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID as string,
      clientSecret: process.env.NAVER_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        await existUser(user?.email ?? "");

        return "/sign-up/already";
      } catch (e) {
        if (
          (e as any)?.response?.status === 403 &&
          (e as any)?.response.data.error === "User not exist"
        ) {
          return `/sign-up?email=${user.email}`;
        }
        // return `/sign-up?email=${user.email}`;
      }
      return false;
      // return true;
      // return false;
    },
    // async redirect(params) {
    //   // // Allows relative callback URLs
    //   // if (url.startsWith("/")) return `${baseUrl}${url}`
    //   // // Allows callback URLs on the same origin
    //   // else if (new URL(url).origin === baseUrl) return url
    //   // return baseUrl
    //   console.log(params);
    //   return `/sign-up`;
    // },
  },
});

export { handler as GET, handler as POST };
