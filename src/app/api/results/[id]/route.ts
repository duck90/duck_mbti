import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);
  try {
    const result = await client.test_result.findUnique({
      where: {
        id: id,
      },
      relationLoadStrategy: "join",
      include: {
        test: true,
      },
    });

    return NextResponse.json(
      { data: result },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json({ id: id, error: "fail" }, { status: 500 });
  }
}
