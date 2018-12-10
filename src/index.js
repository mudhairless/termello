import Vue from 'blessed-vue';
import Vuex from 'vuex';
import App from './App.vue';
import rawStore from './store';

Vue.use(Vuex);
const store = new Vuex.Store(rawStore);

const mainEL = Vue.dom.createElement();
Vue.dom.append(mainEL);


const app = new Vue({
  render: h => h(App),
  store,
}).$mount(mainEL);
