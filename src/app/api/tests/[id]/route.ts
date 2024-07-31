import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = Number(context.params.id);
    const result = await client.test.findUnique({
      where: {
        id: id,
      },
      relationLoadStrategy: "join",
      include: {
        questions: true,
      },
    });

    if (!!result?.questions) {
      result.questions = result?.questions.map((ques) => {
        if (ques.answer) {
          ques.answer = JSON.parse(ques.answer);
        }

        return ques;
      });
    }

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

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = Number(context.params.id);
  const body = await req.json();

  if (!body) {
    return NextResponse.json({}, { status: 400 });
  }

  try {
    const test = await client.test.findUnique({
      where: {
        id: id,
      },
      relationLoadStrategy: "join",
      include: {
        questions: true,
      },
    });

    const questions = test?.questions;
    const answer = body.answer;
    const result = {
      EI: 0.1,
      SN: 0.1,
      TF: 0.1,
      JP: 0.1,
    };
    let mbti = "";

    if (!!questions) {
      questions.forEach((ques, i) => {
        const { EI_point } = ques;
        const { SN_point } = ques;
        const { TF_point } = ques;
        const { JP_point } = ques;

        switch (ques.type) {
          case "radio":
            // 0, 1
            const radioPoint = !answer[i] ? 1 : -1;

            result.EI = result.EI + radioPoint * EI_point;
            result.SN = result.SN + radioPoint * SN_point;
            result.TF = result.TF + radioPoint * TF_point;
            result.JP = result.JP + radioPoint * JP_point;

            break;
          case "level":
            // 0 ~ 4
            const levelPoint = answer[i] - 2;

            result.EI = result.EI + levelPoint * EI_point;
            result.SN = result.SN + levelPoint * SN_point;
            result.TF = result.TF + levelPoint * TF_point;
            result.JP = result.JP + levelPoint * JP_point;

            break;

          default:
            break;
        }
      });

      mbti += result.EI > 0 ? "e" : "i";
      mbti += result.SN > 0 ? "s" : "n";
      mbti += result.TF > 0 ? "t" : "f";
      mbti += result.JP > 0 ? "j" : "p";

      const testResult = await client.test_result.findFirst({
        where: {
          subject_id: id,
          mbti: mbti,
        },
      });

      return NextResponse.json(
        { id: id, result: testResult?.id },
        { status: 200 }
      );
    }
  } catch (e) {
    return NextResponse.json({ id: id, error: e }, { status: 400 });
  }

  return NextResponse.json({ id: id, error: "fail" }, { status: 500 });
}
