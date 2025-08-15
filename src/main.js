import Vue from 'vue'
import App from './App.vue'
// import Mui from 'vue-awesome-mui';

import Vant from 'vant';
import 'vant/lib/index.css'

Vue.use(Vant);
// Vue.prototype.mui = mui


// import './lib/mui-master/dist/css/mui.css'
// import plusExtends from './util/plusextends.js'
// Vue.prototype.$plusExtends = plusExtends
// import mui from './lib/mui-master/dist/js/mui.min.js'
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
