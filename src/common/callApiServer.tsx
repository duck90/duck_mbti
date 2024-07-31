import axios, { AxiosResponse, AxiosError, AxiosInstance } from "axios";
// import Cookies from "js-cookie";

export const instance: AxiosInstance = axios.create({
  timeout: 5000,
});

instance.interceptors.request.use(
  (config: any) => {
    config.url = `${process.env.API_URL}/api${config.url}`;
    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (e) => Promise.reject(e)
);

instance.interceptors.response.use(
  (res: AxiosResponse) => res.data,
  (error: AxiosError) => {
    const { response } = error;

    return Promise.reject(error);
  }
);

export default instance;
