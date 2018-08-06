// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import MuseUI from 'muse-ui';
// import 'muse-ui/dist/muse-ui.css';
import dtime from 'time-formater'

import axios from 'element-ui'
import Vuex from 'vuex'
import global from './global/global.js'
import AMap from 'vue-amap'

Vue.config.productionTip = false

Vue.prototype.$global = global
Vue.prototype.$dtime = dtime

Vue.use(ElementUI)
Vue.use(axios)
Vue.use(Vuex)
// Vue.use(MuseUI);
Vue.use(AMap)
AMap.initAMapApiLoader({
  key: '28966b6be8e4fa0e4c4f4c9b4bf8d3ce',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor']
})

Vue.filter('isTrueFilter', function (item) {
  return item == true ? '是':'否'
})
// type
// 0 实际值*倍数
// 1 变频9 工频17 休息2 热继故障36 空开跳闸68 变频故障132
// 2 无水故障 1 高水信号2 地面积水信号4 相序故障8 出口超压16 门禁报警32
// 3 自动0 手动1
// 4 开启1 关闭0
Vue.filter('pointTypeFilter',function(item){
  var temp = ['实际值*倍数','变频9 工频17 休息2 热继故障36 空开跳闸68 变频故障132',
  '无水故障 1 高水信号2 地面积水信号4 相序故障8 出口超压16 门禁报警32','自动0 手动1','开启1 关闭0','是1 否0']
  return temp[item]
})

Vue.filter('transferTypeFilter',function(item){
  console.log(item)
  return item == 1 ?'Modbus':'TCP S7'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
