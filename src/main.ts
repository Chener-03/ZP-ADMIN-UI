import { createApp } from 'vue';

import TDesign from 'tdesign-vue-next';
import 'tdesign-vue-next/es/style/index.css';
import { store } from './store';
import router from './router';
import '@/style/index.less';
import './permission';
import App from './App.vue';
import VueAnimXyz from '@animxyz/vue3'
import '@animxyz/core'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

const app = createApp(App);

app.use(TDesign);
app.use(store);
app.use(router);
app.use(VueAnimXyz);
app.use(mavonEditor);

app.mount('#app');
