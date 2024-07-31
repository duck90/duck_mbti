import axiosApi from "../common/callApi";
import axiosApiServer from "../common/callApiServer";
import { AxiosResponse, AxiosError } from "axios";

export const existUser = (email: string) => {
  return axiosApiServer({
    method: "POST",
    url: "/users/exist",
    data: { email },
  });
};

export const createUser = (data: {
  email: string;
  password: string;
  nickname: string;
}) => {
  return axiosApi({
    method: "POST",
    url: "/users",
    data,
  });
};

export const getUserToken = (email: string) => {
  return axiosApi({
    method: "GET",
    url: `/users/token?email=${email}`,
  });
};

export const getUserInfo = () => {
  return axiosApi({
    method: "GET",
    url: "/users/me",
  });
};

export const loginUser = (data: {
  email: string;
  password: string;
}): Promise<{ access_token: string; refresh_token: string }> => {
  return axiosApi({
    method: "POST",
    url: "/users/login",
    data,
  });
};

export const logoutUser = (data: { email: string }): Promise<null> => {
  return axiosApi({
    method: "POST",
    url: "/users/logout",
    data,
  });
};
