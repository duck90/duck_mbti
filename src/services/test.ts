import axiosApi from "../common/callApi";

export const getTestList = () => {
  return axiosApi({
    method: "GET",
    url: "/tests",
  });
};

export const getTestDetailInfo = (id: number) => {
  return axiosApi({
    method: "GET",
    url: `/tests/${id}`,
  });
};

export const postMbtiResult = ({
  id,
  answer,
}: {
  id: number;
  answer: number[];
}): Promise<{ id: number; result: number }> => {
  return axiosApi({
    method: "POST",
    url: `/tests/${id}`,
    data: { answer },
  });
};

export const getResultData = ({
  id,
  result,
}: {
  id: number;
  result: number;
}) => {
  return axiosApi({
    method: "GET",
    url: `/results/${id}/${result}`,
  });
};
