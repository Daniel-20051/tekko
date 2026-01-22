import { useMutation, useQueryClient } from '@tanstack/react-query'
import * as kycApi from '../api/kyc.api'
import type { SubmitBvnRequest } from '../types/kyc'
import { authKeys } from './useAuth'

// Hook for BVN submission mutation
export const useSubmitBvn = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: SubmitBvnRequest) => {
      return kycApi.submitBvn(data)
    },
    onSuccess: () => {
      // Invalidate and refetch user data to update KYC level
      queryClient.invalidateQueries({ queryKey: authKeys.currentUser() })
    },
  })
}
