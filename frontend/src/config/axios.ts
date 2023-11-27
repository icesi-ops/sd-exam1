import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://localhost:8080';

const instance: AxiosInstance = axios.create({
  baseURL
});

export default instance;

