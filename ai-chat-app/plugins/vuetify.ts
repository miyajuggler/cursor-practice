// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#1976D2',
            secondary: '#424242',
          },
        },
        dark: {
          colors: {
            primary: '#2196F3',
            secondary: '#424242',
          },
        },
      },
    },
  });

  app.vueApp.use(vuetify);
});
