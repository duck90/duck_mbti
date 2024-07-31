import axiosApi from "../common/callApi";

export const getResultData = (id: number) => {
  return axiosApi({
    method: "GET",
    url: `/results/${id}`,
  });
};
