import { Grammar } from "~~/types/Grammar"

export const useGrammar = () => {
    let { $axios } = useNuxtApp()
    const axios = $axios()
    const grammarState =  useState<Grammar[]>('grammar', () => [])
    const initGrammar = (amount: number) => {
        grammarState.value = [];
        for (let index = 0; index < amount; index++) {
            grammarState.value.push({
                producer: (index == 0) ? String.fromCharCode(83): String.fromCharCode(64 + index),
                products: []
            })
        }
    }
    const sendData = async (word:string, response:(res:any) => void) =>{
        return axios.post('api/v1/responses', {grammar: grammarState.value, word: word}).then(res =>{
            console.log(res.data)
            response(res)
        }).catch(err => {
            console.log(err)
        }); 
    }
    return {
        grammarState,
        initGrammar,
        sendData
    }
}