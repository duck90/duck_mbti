import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const email = body?.email;

  try {
    await client.user.update({
      where: { email },
      data: {
        access_token: null,
        refresh_token: null,
      },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    return NextResponse.json({}, { status: 500 });
  }
}
