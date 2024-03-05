<template>
    <v-container>
    <h1 class="mb-4">Table Result 🏆</h1>
    <v-table theme="light">
        <thead>
        <tr>
            <template  v-for="letter in word.length" :key="letter">
                <th class="text-center">
                {{word.slice(0,letter)}}
                </th>
            </template>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in data" :key="item" >
            <template v-for= "prop in item" :key="prop">
                <td class="text-center">{{ prop}}</td>
            </template>
        </tr>
        </tbody>
  </v-table>
</v-container>
</template>

<script>
    export default {
        props: {
            data: null,
            word: null
        }
    }
</script>