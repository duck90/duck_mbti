import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SHA256 } from "crypto-js";

const client = new PrismaClient();

// export async function GET(req: NextRequest) {
//   try {
//     const params = new URLSearchParams(req.nextUrl.search);
//     const email = params.get("email") as string;

//     const user = await client.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     return NextResponse.json(
//       {
//         jwt: jwt.sign(
//           { email: user?.email },
//           process.env.JWT_SECRET as string,
//           { expiresIn: 24 * 60 * 60 }
//         ),
//       },
//       { status: 200 }
//     );
//   } catch (e) {
//     return NextResponse.json(
//       { error: e },
//       {
//         status: 500,
//       }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  const body: {
    email: string;
    password: string;
    nickname: string;
  } = await req.json();

  try {
    const user = await client.user.create({
      data: {
        email: body.email,
        password: SHA256(body.password).toString(),
        nickname: body.nickname,
        image_url: "",
        created_at: new Date(),
        updated_at: new Date(),
        deleted_at: null,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({}, { status: 500 });
  }
}
