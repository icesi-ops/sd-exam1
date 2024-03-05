<template>
        <v-sheet class="bg-grey-lighten-3 pa-md-12 py-sm-4" rounded>
            <v-card class="mx-auto px-6 py-8" color="background" max-width="600px">

                <div v-if="isFirst">
                        <v-text-field v-model="word" clearable label="Word" prepend-icon="mdi-vuetify" :rules="[required]"/>
                        <v-text-field v-model="amountOfProducers" clearable label="Amount of Producers" prepend-icon="mdi-bag-carry-on-check" type="number" :rules="[required]"/>
                        <div style="width: 100%;display:flex;justify-content:end">
                            <v-btn :disabled="(amountOfProducers <= 0 || word === '' || word == null)" class="mt-2" @click="initGrammar(amountOfProducers);handleNext()">Next</v-btn>
                        </div>
                 </div>

                <div v-else>
                    <div  v-for="(grammar,index) in  grammarState" :key="index">
                        <div style="display:flex; align-items:center" key={{index}}>
                            <h1 class="mr-4 mb-4"> {{grammar.producer}} </h1>
                            <v-combobox clearable v-model="grammar.products" label="Products" placeholder="Enter for adding"  multiple chips/>
                        </div>
                    </div>
                    <div style="width: 100%;display:flex;justify-content:end">
                        <v-btn class="mt-2 mr-2" color="error" @click="handleBack">Back</v-btn>
                        <v-btn class="mt-2" v-on:click="sendData(word, (res) => {
                            response = res.data.response;
                            dataTable = res.data.matrix;
                            alert = true
                        })">Send</v-btn>
                    </div>
                </div>

            </v-card>
            <div v-if="alert" style="margin-top: 50px;">
                <v-alert border="start" variant="tonal" :class="response ? 'bg-green' : 'bg-red'" title="Response from server 🗞️" >
                    The server response for the grammar already specified is <b>{{response}}</b>. Language {{(response ? 'Accepted' : 'Rejected')}}
                </v-alert>
            </div>
        </v-sheet>
        <div v-if="response" style="margin-top: 50px;">
            <Table :word="word" :data="dataTable"/>
        </div>
</template>

<script setup lang="ts">
    const { grammarState, initGrammar, sendData} = useGrammar()
</script>

<script lang="ts">
    export default {
        data: () => ({
                isFirst: true,
                amountOfProducers: 0,
                word: '',
                alert: false,
                response: false,
                dataTable: []
        }),
        methods: {
            required (v:any) {
                return !!v || 'Field is required'
            },
            handleNext(){
                this.isFirst = false
            },
            handleBack(){
                this.isFirst = true
            }
        }
}
   
</script>