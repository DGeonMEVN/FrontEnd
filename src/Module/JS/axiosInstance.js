import VueCookies from "vue-cookies";
import axios from "axios";
import router from "@/router/index.js";
import { userStore } from "@/stores/user.js";


const { VITE_KEY_APP_URL } = import.meta.env;

const AxiosInst = axios.create({
  baseURL: VITE_KEY_APP_URL
});

AxiosInst.interceptors.request.use(
  (config) => {

    let accessToken = VueCookies.get("authorization");
    let refreshToken = VueCookies.get("refresh");
    // console.log("accessToken", accessToken);
    // console.log("refreshToken", refreshToken);

    if (accessToken && refreshToken) {
      config.headers.Authorization = accessToken;
      config.headers.Refresh = refreshToken;
      return config;
    } else {
      VueCookies.remove("authorization");
      VueCookies.remove("refresh");
      userStore().logout();
      router.replace("/auth/login");
    }
  }
);

AxiosInst.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Handle unauthorized access
      // For example, refresh token logic can go here
    }
    return Promise.reject(error);
  },
);

export default AxiosInst;