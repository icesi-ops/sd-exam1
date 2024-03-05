<template>
    <div >
      <v-toolbar
        dark
        prominent
        image="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      >
        <v-app-bar-nav-icon color="background"></v-app-bar-nav-icon>
  
        <v-toolbar-title>CYK ALGORITHM ✍️</v-toolbar-title>
  
        <v-spacer></v-spacer>
  
        <v-btn icon>
          <v-icon color="background">mdi-export</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container >
        <slot/>
      </v-container>
    </div>
  </template>

<script>
  export default {
    data: () => ({
    mounted () {
      console.log(this.$vuetify.breakpoint.width)
    }
  })
}
</script>