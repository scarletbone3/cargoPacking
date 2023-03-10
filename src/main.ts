import { createApp } from "vue";
import App from "./App.vue";
import VueKonva from "vue-konva";

import "./assets/main.css";

createApp(App).use(VueKonva).mount("#app");
