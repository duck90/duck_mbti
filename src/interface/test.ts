export interface ITest {
  active: boolean;
  createdAt: string;
  description: string;
  id: number;
  order_no: number;
  question_count: number;
  subtitle: string;
  title: string;
  updatedAt: string;
}

export interface ITestDetailInfo extends ITest {
  qustions?: ITestQuestion[];
}

export interface ITestQuestion {
  EI_point: number;
  JP_point: number;
  SN_point: number;
  TF_point: number;
  answer?: string[];
  createdAt: string;
  id: number;
  order_no: number;
  question: string;
  subject_id: number;
  type: "radio" | "level";
}
