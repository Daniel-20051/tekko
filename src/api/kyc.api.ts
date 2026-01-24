import { apiClient } from '../lib/api-client'
import type { SubmitBvnRequest, SubmitBvnResponse, CreateCustomerRequest, CreateCustomerResponse } from '../types/kyc'

// Submit BVN API call
export const submitBvn = async (data: SubmitBvnRequest): Promise<SubmitBvnResponse> => {
  const response = await apiClient.post<SubmitBvnResponse>('/kyc/submit/bvn', data)
  return response.data
}

// Create customer profile API call
export const createCustomer = async (data: CreateCustomerRequest): Promise<CreateCustomerResponse> => {
  const response = await apiClient.post<CreateCustomerResponse>('/api/v1/wallet/customer/create', data)
  if (response.data.success) {
    return response.data
  }
  throw new Error(response.data.message || 'Failed to create customer profile')
}
