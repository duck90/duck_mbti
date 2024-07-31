import { NextRequest, NextResponse } from "next/server";
import authMiddleware from "@/middlewares/auth.middleware";
import { IUserSchema } from "@/interface/user";

export async function GET(req: NextRequest) {
  try {
    const user = (await authMiddleware(req)) as IUserSchema;

    if (!!user) {
      return NextResponse.json(
        {
          email: user.email,
          image_url: user.image_url,
          nickname: user.nickname,
          created_at: user.created_at,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          error: "Error",
        },
        { status: 500 }
      );
    }
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
