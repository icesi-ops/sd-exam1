<template>
    <v-layout justify-center align-center>
      <v-container fill-height>

        <v-row align="center" no-gutters class="mb-10">
          <v-col cols="12">
              <v-alert color="info" type="warning" prominent border="start" variant="elevated">
                <b>Use Rules: </b> ...
              </v-alert>
          </v-col>
        </v-row>

        <Form />

      </v-container>
    </v-layout>
</template>

<script lang="ts">
  export default {
    data: () => ({
      headers: [
        { text: 'Producer', align: 'center', sortable: false, value: 'producer'},
        { text: 'Products', align: 'center', sortable: false, value: 'products'},
      ],
      grammar: [],
    }),
  }
</script>