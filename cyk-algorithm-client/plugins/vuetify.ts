// plugins/vuetify.js
import { createVuetify, ThemeDefinition } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md2 } from 'vuetify/blueprints'

const myTheme: ThemeDefinition = {
    dark: false,
    colors: {
      background: '#ffffff',
      surface: '#fb6066',
      primary: '#f66b40',
      secondary: '#fdd86e',
      error: '#dd423e',
      info: '#ffffff',
      success: '#cbe86b',
      warning: '#f5c273',
    }
}
  
export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    blueprint: md2,
    theme: {
        defaultTheme: 'myTheme',
        themes: {
            myTheme,
        }
    },
    display: {
      mobileBreakpoint: 'sm',
      thresholds: {
        xs: 320,
        sm: 340,
        md: 540,
        lg: 800,
        xl: 1280,
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})