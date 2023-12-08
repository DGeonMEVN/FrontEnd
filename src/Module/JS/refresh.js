import axios from "axios";
import VueCookies from "vue-cookies";
import router from "@/router/index.js";
const { VITE_KEY_APP_URL } = import.meta.env;

const AxiosInst = axios.create({
  baseURL: VITE_KEY_APP_URL
});

export default function refreshJS() {
  console.log("refreshJS 함수 호출됨");
  let accessToken = VueCookies.get("authorization");
  let refreshToken = VueCookies.get("refresh");

  AxiosInst.interceptors.request.use(
    (config) => {
      if (accessToken && refreshToken) {
        config.headers.Authorization = accessToken;
        config.headers.Refresh = refreshToken;
        return config;
      } else {
        VueCookies.remove("authorization");
        VueCookies.remove("refresh");
        router.replace("/auth/login");
      }
    }
  );

  AxiosInst
    .get("/api/auth/refresh")
    .then((response) => {
      if (!response.data.ok) {
        VueCookies.remove("authorization");
        VueCookies.remove("refresh");
        router.replace("/auth/login");
      } else if (response.data.data.accessToken) {
        VueCookies.set("authorization", response.data.data.accessToken);
        VueCookies.set("refresh", response.data.data.refreshToken);
      } else {
        router.replace("/");
      }
    })
    .catch(() => {
      console.log("아무겂도 없어");
      VueCookies.remove("authorization");
      VueCookies.remove("refresh");
      router.replace("/auth/login");
    });
}