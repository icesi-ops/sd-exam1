import axios, { AxiosInstance } from 'axios';

const baseURL = 'https://api.example.com';

const instance: AxiosInstance = axios.create({
  baseURL
  
});

export default instance;

