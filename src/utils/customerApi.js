import axios from 'axios'

const customerApi = axios.create({
  baseURL: 'https://eatwella.tfnsolutions.us/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

customerApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('customer_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default customerApi
