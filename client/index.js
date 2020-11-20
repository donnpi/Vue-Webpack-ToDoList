import Vue from 'vue';
import App from './app.vue';

//import './assets/styles/test.css';
import './assets/styles/style.styl'
import './assets/styles/global.styl';

// 创建div插入到body里
const root = document.createElement('div');
document.body.appendChild(root);

new Vue({
    // render 渲染App
    render: (h) => h(App)
        // mount 将App挂载到html节点上
}).$mount(root)