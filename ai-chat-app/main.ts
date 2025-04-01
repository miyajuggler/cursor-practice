import { createApp } from 'vue';
import App from './app.vue';
import vuetify from './plugins/vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App);
app.use(vuetify);
app.mount('#app');
