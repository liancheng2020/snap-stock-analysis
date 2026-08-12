import axios from 'axios'

export type Market = 'A' | 'HK' | 'US'
export type TaskState = 'PENDING' | 'PROGRESS' | 'SUCCESS' | 'FAILURE'

export interface AgentResult {
  key: string
  name: string
  score: number
  conclusion: string
  signals: string[]
}

export interface AnalysisTask {
  task_id: string
  symbol: string
  market: Market
  depth: number
  state: TaskState
  progress?: {
    step: number
    total: number
    agent: string
    message: string
  }
  result?: {
    symbol: string
    market: Market
    depth: number
    score: number
    rating: string
    summary: string
    agents: AgentResult[]
    risks: string[]
    disclaimer: string
  }
  error?: string
  created_at: string
  updated_at: string
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api',
  timeout: 30_000
})

export const startAnalysis = (symbol: string, market: Market, depth: number) =>
  api.post<{ task_id: string; state: TaskState }>('/analysis/single', { symbol, market, depth })

export const getTask = (id: string) => api.get<AnalysisTask>(`/tasks/${id}`)
export const getTasks = (limit = 20) => api.get<AnalysisTask[]>('/tasks', { params: { limit } })

export default api
