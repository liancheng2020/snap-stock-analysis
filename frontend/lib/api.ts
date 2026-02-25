import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
  timeout: 30000
})

export const startAnalysis = (symbol: string) => api.post('/analysis/single', { symbol })
export const getTask = (id: string) => api.get(`/tasks/${id}`)

export default api
