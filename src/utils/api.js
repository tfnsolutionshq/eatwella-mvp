import axios from 'axios'

const api = axios.create({
  baseURL: 'https://eatwella.tfnsolutions.us/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
