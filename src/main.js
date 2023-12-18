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

const app = createApp(App);
// app.use(createPinia());
const pinia = createPinia();
app.use(pinia);
pinia.use(piniaPluginPersistedstate);
app.use(router);
app.use(materialKit);
app.use(VueCookies);
app.mount("#app");
