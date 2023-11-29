import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://localhost:8005';

const instance: AxiosInstance = axios.create({
  baseURL
});

export default instance;

