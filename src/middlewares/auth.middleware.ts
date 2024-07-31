import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export default async (req: NextRequest) => {
  try {
    const cookieStore = req.cookies;
    const accessToken = cookieStore.get("dbti_access_token")?.value ?? "";
    const refreshToken = cookieStore.get("dbti_refresh_token")?.value ?? "";
    let user = null;

    // Access Token 검증하기
    const accessPayload = validToken(
      accessToken,
      process.env.JWT_SECRET as string
    );

    // Refresh Token 검증하기
    const refreshPayload = validToken(
      refreshToken,
      process.env.JWT_SECRET as string
    );

    // redis에 저장한 refresh token 가져오기
    // const redisRefreshToken = await redisClient.get(refreshToken);

    // case 1) access token이 없을때
    if (!accessToken) {
      return NextResponse.json({ error: "Not Access Token" }, { status: 401 });
    }

    // case 2) accesstoken이 만료되고, refreshtoken은 있을때
    if (!accessPayload) {
      if (
        !!refreshPayload
        // && Number(redisRefreshToken) === jwt.decode(refreshToken).user_id
      ) {
        const email = (refreshPayload as { email: string }).email;
        const accessToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
          expiresIn: "1d",
        });
        const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
          expiresIn: "7d",
        });

        user = await client.user.update({
          where: { email },
          data: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        });
      }
    }

    // case 3) refreshtoken 없을때, accesstoken이 인증되었다면 새로운 refreshtoken 발급해주기
    if (!refreshToken) {
      if (accessPayload) {
        const email = (accessPayload as { email: string }).email;

        const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
          expiresIn: "7d",
        });

        user = await client.user.update({
          where: { email },
          data: { refresh_token: refreshToken },
        });
      }
    }

    // case 4) redis에 refresh token 없을 때
    // if (!redisRefreshToken) {
    //   return res
    //     .status(401)
    //     .json({ message: "REFRESH TOKEN이 서버에 존재하지 않습니다." });
    // }

    return user;
  } catch (error) {
    return NextResponse.json({}, { status: 500 });
  }
};

// 토큰 검증 함수
function validToken(token: string, secretKey: string) {
  try {
    const payload = jwt.verify(token, secretKey);
    return payload;
  } catch (error) {
    console.log(error);
  }
}
