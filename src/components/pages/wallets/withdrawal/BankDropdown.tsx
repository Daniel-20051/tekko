import { useState, useEffect, useRef, useMemo } from 'react'
import { ChevronDown, Check, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../../../ui/Button'
import Input from '../../../ui/Input'
import type { Bank } from '../../../../types/bank'

interface BankDropdownProps {
  banks: Bank[] | undefined
  selectedInstitutionId: string
  onSelectBank: (institutionId: string) => void
  isLoading?: boolean
}

const BankDropdown = ({ banks, selectedInstitutionId, onSelectBank, isLoading = false }: BankDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, opensUpward: false, maxHeight: 240 })
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Ensure banks is always an array and filter only banks with institutionId
  const banksArray = Array.isArray(banks) ? banks.filter(b => b.institutionId) : []
  const selectedBank = banksArray.find(b => b.institutionId === selectedInstitutionId)

  // Filter banks based on search query
  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) {
      return banksArray
    }
    const query = searchQuery.toLowerCase().trim()
    const filtered = banksArray.filter(bank => 
      bank.name?.toLowerCase().includes(query) ||
      bank.code?.toLowerCase().includes(query)
    )
    console.log('🔍 Bank Filter:', { query, totalBanks: banksArray.length, filteredCount: filtered.length })
    return filtered
  }, [banksArray, searchQuery])

  // Calculate dropdown position when it opens or window resizes/scrolls
  useEffect(() => {
    const updatePosition = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const spaceBelow = viewportHeight - rect.bottom
        const spaceAbove = rect.top
        const dropdownMaxHeight = 240 // max-h-60 = 240px
        const gap = 4 // Gap between button and dropdown
        
        // Check if we should open upward
        const opensUpward = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow
        
        // Calculate max height based on available space
        let maxHeight = dropdownMaxHeight
        if (opensUpward) {
          // If opening upward, use space above minus gap and some padding
          maxHeight = Math.min(dropdownMaxHeight, spaceAbove - gap - 16)
        } else {
          // If opening downward, use space below minus gap and some padding
          maxHeight = Math.min(dropdownMaxHeight, spaceBelow - gap - 16)
        }
        
        // Ensure minimum height
        maxHeight = Math.max(maxHeight, 100)
        
        // Calculate top position
        let top: number
        if (opensUpward) {
          // Position above the button
          top = rect.top + window.scrollY - maxHeight - gap
        } else {
          // Position below the button
          top = rect.bottom + window.scrollY + gap
        }
        
        setPosition({
          top,
          left: rect.left + window.scrollX,
          width: rect.width,
          opensUpward,
          maxHeight,
        })
      }
    }

    if (isOpen) {
      updatePosition()
      
      // Update position on scroll and resize
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isOpen])

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else if (!isOpen) {
      setSearchQuery('') // Clear search when dropdown closes
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (institutionId: string) => {
    onSelectBank(institutionId)
    setIsOpen(false)
  }

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <Button
        ref={buttonRef}
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="w-full !justify-between bg-white dark:bg-dark-surface border border-gray-200 dark:border-primary/50 h-[42px]"
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-white text-left flex-1">
          {selectedBank ? selectedBank.name : isLoading ? 'Loading banks...' : 'Select a bank'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      <AnimatePresence mode="wait">
        {isOpen && position.width > 0 && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: position.opensUpward ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: position.opensUpward ? 10 : -10 }}
            transition={{ duration: 0.15 }}
            className="fixed bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-gray-700 shadow-xl z-[9999] overflow-hidden flex flex-col"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              maxHeight: `${position.maxHeight}px`,
            }}
          >
            {/* Search Box */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search banks..."
                  className="pl-9 pr-3"
                />
              </div>
            </div>

            {/* Banks List */}
            <div className="overflow-y-auto flex-1" key={`banks-list-${searchQuery}-${filteredBanks.length}`}>
              {isLoading ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  Loading banks...
                </div>
              ) : filteredBanks.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  {searchQuery.trim() ? `No banks found matching "${searchQuery}"` : 'No banks available'}
                </div>
              ) : (
                filteredBanks.map((bank, index) => {
                  const isSelected = selectedInstitutionId === bank.institutionId
                  // Create unique key using institutionId, name, and index
                  const uniqueKey = bank.institutionId || `${bank.code}-${bank.name}-${index}`

                  return (
                    <button
                      key={uniqueKey}
                      onClick={() => bank.institutionId && handleSelect(bank.institutionId)}
                      disabled={!bank.institutionId}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className={`text-sm font-medium ${isSelected ? 'text-primary dark:text-primary' : 'text-gray-900 dark:text-white'}`}>
                        {bank.name}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BankDropdown
