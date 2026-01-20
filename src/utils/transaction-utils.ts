import type { TransactionType } from '../types/transaction'

export const getServiceName = (type: TransactionType | string | undefined | null): string => {
  if (!type) return 'UNKNOWN'
  
  switch (type) {
    case 'deposit':
      return 'BANK TRANSFER DIRECT DEPOSIT'
    case 'withdrawal':
      return 'WITHDRAWAL'
    case 'transfer':
      return 'TRANSFER'
    case 'trade':
      return 'TRADE'
    case 'fee':
      return 'FEE'
    case 'manual_credit':
      return 'MANUAL CREDIT'
    default:
      return String(type).toUpperCase().replace(/_/g, ' ')
  }
}
