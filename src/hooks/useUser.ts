import useSWR from "swr";
import { getUserInfo } from "@/services/user";
import { useCookies } from "react-cookie";

export default function useUser() {
  const [cookies] = useCookies();
  const token = cookies["dbti_access_token"];
  const { data, error } = useSWR(!!token ? "user_info/me" : null, getUserInfo);

  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  };
}
