import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET() {
  try {
    const result = await client.test.findMany();

    return NextResponse.json(
      { data: result },
      {
        status: 200,
      }
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
