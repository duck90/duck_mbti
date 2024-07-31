import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body && body?.email) {
    return NextResponse.json({}, { status: 400 });
  }

  try {
    const result = await client.user.findFirst({
      where: {
        email: body?.email,
      },
    });

    if (!result) {
      return NextResponse.json({ error: "User not exist" }, { status: 403 });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
