import { ITest } from "./test";

export interface IResult {
  createdAt: string;
  id: number;
  mbti: string;
  subject_id: number;
  updatedAt: string;
  filename: string;
  test: ITest;
  width: number;
  height: number;
}
