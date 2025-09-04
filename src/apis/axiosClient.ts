import axios, { AxiosHeaders } from "axios";
import { supabase } from "../libs/supabaseClient";

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(async (config) => {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    const headers = AxiosHeaders.from(config.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      // invalid 시 헤더에서 제거
      headers.delete("Authorization");
    }
    config.headers = headers;
  } catch {
    // Authorization 없이 계속 진행
  }
  return config;
});

export default axiosClient;
