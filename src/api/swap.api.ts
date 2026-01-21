import { apiClient } from '../lib/api-client'
import type {
  SwapPairsResponse,
  SwapPairsData,
  SwapCalculateRequest,
  SwapCalculateResponse,
  SwapQuoteData,
  SwapExecuteRequest,
  SwapExecuteResponse,
  SwapExecuteData
} from '../types/swap'

// Get supported trading pairs
export const getSwapPairs = async (): Promise<SwapPairsData> => {
  const response = await apiClient.get<SwapPairsResponse>('/api/v1/swap/pairs')
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to get swap pairs')
}

// Calculate swap (preview)
export const calculateSwap = async (data: SwapCalculateRequest): Promise<SwapQuoteData> => {
  const response = await apiClient.post<SwapCalculateResponse>('/api/v1/swap/calculate', data)
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to calculate swap')
}

// Execute swap
export const executeSwap = async (data: SwapExecuteRequest): Promise<SwapExecuteData> => {
  const response = await apiClient.post<SwapExecuteResponse>('/api/v1/swap', data)
  if (response.data.success) {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to execute swap')
}
