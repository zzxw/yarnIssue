import Vue from 'vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import router from './router';
import store from './store';
import App from './App.vue';
import * as filters from './filters/index.js';
import serviceurl from './common/serviceurl.js';

//引入css重置文件,基本的样式文件
//require('./css/reset.css');
//3rd party icon libarary
//require('./css/icono.min.css');

// 引入px与rem的换算
//require('./js/equ.js');

// 遍历输出a过滤器的模块
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));

Vue.use(ElementUI);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');