import { createApp } from "vue";
import App from "./App.vue";
import { Button, Input, Spin, Table, Tag } from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

createApp(App)
  .use(Button)
  .use(Table)
  .use(Spin)
  .use(Tag)
  .use(Input)
  .mount("#app");
