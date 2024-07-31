import { NextRequest, NextResponse } from "next/server";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { SHA256 } from "crypto-js";

const client = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body?.email;
  const password = SHA256(body?.password).toString();

  if (!body && !!email && !!password) {
    return NextResponse.json(
      { error: "Missing Email or Password" },
      { status: 400 }
    );
  }

  try {
    const user = await client.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not exist" }, { status: 403 });
    }

    if (password !== user.password) {
      return NextResponse.json({ error: "Wrong Password" }, { status: 403 });
    }

    const accessToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    const refreshToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    await client.user.update({
      where: { email },
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
      },
    });

    return NextResponse.json(
      { access_token: accessToken, refresh_token: refreshToken },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
