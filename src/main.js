import Vue from 'vue'
import App from './App.vue'
import store from './store'
import './style/reset.css'
import $ from 'jquery'
import VueDraggableResizable from 'vue-draggable-resizable'
import './plugins/element.js'
Vue.config.productionTip = false

window.$ = $
Vue.component('vue-draggable-resizable', VueDraggableResizable)
new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
