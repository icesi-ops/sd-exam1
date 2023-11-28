import axios from '../config/axios'
import { GameType } from '../schemas/GameSchema';
import  { AxiosError } from 'axios';


const entity = 'games';

const getGames = async () => {
    try {
        const res = await axios.get(`/${entity}`);
        return res.data;
    } catch (error) {
        const err = error as AxiosError
        console.log(err.response?.data)
      }
};


const addGame = async (game: GameType) => {
    try {
        const res = await axios.post(`/${entity}`, game);
        return res.data;
    } catch (error) {
        const err = error as AxiosError
        console.log(err.response?.data)
      }
};

const editGame = async (game: GameType) => {
    try {
        const res = await axios.put(`/${entity}/edit/${game.id}`, game);
        return res.data;
    } catch (error) {
        const err = error as AxiosError
        console.log(err.response?.data)
      }
};

const deleteGame = async (id: string) => {
    try {
        const res = await axios.delete(`/${entity}/${id}`);
        return res.data;
    } catch (error) {
        const err = error as AxiosError
        console.log(err.response?.data)
      }
};

const GameService = {
    getGames,
    addGame,
    editGame,
    deleteGame
};

export default GameService;
