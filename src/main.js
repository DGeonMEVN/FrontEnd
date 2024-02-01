import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import VueCookies from "vue-cookies";
// Nucleo Icons
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import materialKit from "./material-kit";

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const app = createApp(App); // Vue 애플리케이션 생성
// app.use(createPinia());
const pinia = createPinia(); // Pinia 상태 관리 라이브러리의 인스턴스 생성
app.use(pinia); // 애플리케이션에 Pinia 추가
app.component('VueDatePicker', VueDatePicker);
pinia.use(piniaPluginPersistedstate); // Pinia 플러그인으로 상태를 영속화하는 라이브러리 추가
app.use(router); // Vue 라우터 추가
app.use(materialKit); // Material Kit Vue UI 라이브러리 추가
app.use(VueCookies); // VueCookies 라이브러리 추가 (브라우저 쿠키 관리)
app.mount("#app"); // 애플리케이션을 DOM에 마운트
