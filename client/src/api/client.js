import axios from 'axios';

const client = axios.create({ baseURL: 'http://localhost:4029/api/' });

export default client;
