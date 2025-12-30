import { useState, useEffect } from 'react'
import SettingsHeader from '../../components/pages/settings/SettingsHeader'
import { useSecurityStatus, useSessions, useProfile } from '../../hooks/useSettings'
import ProfileTab from '../../components/pages/settings/ProfileTab'
import SecurityTab from '../../components/pages/settings/SecurityTab'
import SessionsTab from '../../components/pages/settings/SessionsTab'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'sessions'>('profile')
  
  // Prefetch data in the background when settings page loads
  useSecurityStatus()
  useSessions()
  useProfile()

  // Check for Google linking data and switch to Security tab
  useEffect(() => {
    const linkingData = sessionStorage.getItem('google_linking_data')
    if (linkingData) {
      // Switch to Security tab to show the linking modal
      setActiveTab('security')
    }
  }, [])

  return (
    <div className="max-w-[1600px] mx-auto">
      <SettingsHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-4 pt-4">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'sessions' && <SessionsTab />}
      </div>
    </div>
  )
}

export default SettingsPage

