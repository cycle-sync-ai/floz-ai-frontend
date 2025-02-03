import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const opendaiApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_OPENAI_URL,
})
export default api;
export {opendaiApi};