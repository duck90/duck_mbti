import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const client = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const params = new URLSearchParams(req.nextUrl.search);
    const email = params.get("email") as string;

    const user = await client.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not exist" }, { status: 403 });
    }

    return NextResponse.json(
      {
        jwt: jwt.sign(
          { email: user?.email },
          process.env.JWT_SECRET as string,
          { expiresIn: 24 * 60 * 60 }
        ),
      },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { error: e },
      {
        status: 500,
      }
    );
  }
}
