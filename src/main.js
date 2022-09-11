import Vue from "vue";
import App from "./App.vue";

// plugins
import VueKatex from "vue-katex";
import Buefy from "buefy";

// css
import "buefy/dist/buefy.css";
import "font-awesome/css/font-awesome.min.css";
import "katex/dist/katex.min.css";

//mixins
import { globalMixin } from "@/mixins/global-mixin";
import { TimePattern } from "./utils/time-pattern";

Vue.use(Buefy);
Vue.use(VueKatex, {
  globalOptions: {}
});
Vue.config.productionTip = false;

Vue.mixin(globalMixin);
Vue.prototype.$tp = TimePattern;

new Vue({
  render: (h) => h(App)
}).$mount("#app");
