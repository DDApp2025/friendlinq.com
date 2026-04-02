import axios from 'axios';

export const nodeApi = axios.create({
  baseURL: 'https://natural.friendlinq.com',
});

nodeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessUserToken');
  if (token) {
    config.headers['authorization'] = token;
  }
  return config;
});

export const dotnetApi = axios.create({
  baseURL: 'https://unpokedfolks.com/api',
  headers: { 'Content-Type': 'application/json' },
});
