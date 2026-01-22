import { apiClient } from '../lib/api-client'
import type { SubmitBvnRequest, SubmitBvnResponse } from '../types/kyc'

// Submit BVN API call
export const submitBvn = async (data: SubmitBvnRequest): Promise<SubmitBvnResponse> => {
  const response = await apiClient.post<SubmitBvnResponse>('/kyc/submit/bvn', data)
  return response.data
}
