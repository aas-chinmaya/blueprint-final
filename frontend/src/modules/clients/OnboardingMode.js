




'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Loader2,
  Users,
  Settings,
  ChevronLeft,
  Search,
  Briefcase,
  Handshake,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const dummyContacts = [
  { contactId: '101', name: 'John Doe', company: 'Acme Inc.' },
  { contactId: '102', name: 'Jane Smith', company: 'Beta Corp' },
  { contactId: '103', name: 'Michael Lee', company: 'Gamma Ltd.' },
  { contactId: '104', name: 'Emily Clark', company: 'Delta Co' },
  { contactId: '105', name: 'Robert Brown', company: 'Omega Group' },
  { contactId: '106', name: 'Sophia Turner', company: 'NovaSoft' },
  { contactId: '107', name: 'Daniel Wilson', company: 'SkyNet Ltd.' },
  { contactId: '108', name: 'Olivia Davis', company: 'Matrix Org' },
  { contactId: '109', name: 'James Anderson', company: 'NextTech' },
  { contactId: '110', name: 'Grace Miller', company: 'Quantum Inc.' },
]

export default function OnboardingMode() {
  const router = useRouter()
  const [mode, setMode] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [search, setSearch] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const filteredContacts = dummyContacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    if (mode === 'manual') {
      setLoading(true)
      const timeout = setTimeout(() => {
        router.push('/client/onboarding?mode=manual')
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [mode, router])

  const handleAutoOnboard = () => {
    if (selectedContact) {
      setLoading(true)
      setTimeout(() => {
        router.push(`/client/onboarding?mode=auto&contactId=${selectedContact.contactId}`)
      }, 800)
    }
  }

  const handleBack = () => {
    setMode(null)
    setSelectedContact(null)
    setSearch('')
  }

  return (
    <div className="h-[500px] w-full p-6 flex flex-col justify-center">
      {loading ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-4">
          <Loader2 className="animate-spin h-10 w-10 text-green-600" />
          <p className="text-base text-green-700 font-medium">Redirecting, please wait...</p>
        </div>
      ) : !mode ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6">
          <Settings className="w-10 h-10 text-green-700" />
          <h2 className="text-xl font-semibold text-green-800">Choose Onboarding Mode</h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Select how you want to onboard a client. You can either do it manually or choose from
            existing contacts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Button
              onClick={() => setMode('manual')}
              className="bg-green-600 hover:bg-green-700 text-white px-6"
            >
              Manual Onboarding
            </Button>
            <Button
              onClick={() => setMode('auto')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6"
            >
              Auto Onboarding
            </Button>
          </div>
        </div>
      ) : (
        mode === 'auto' && (
          <div className="flex flex-col space-y-6 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Select a Contact to Onboard
              </h2>
              <Button
                size="icon"
                variant="outline"
                className="rounded-full border-blue-200 hover:bg-blue-50"
                onClick={handleBack}
              >
                <ChevronLeft className="h-5 w-5 text-blue-700" />
              </Button>
            </div>

            <div className="relative w-full z-10">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 border border-gray-300 hover:border-black rounded-lg cursor-pointer bg-white flex items-center justify-between"
              >
                <div className="flex items-center gap-2 text-gray-800">
                  <Briefcase className="w-4 h-4" />
                  {selectedContact ? selectedContact.name : 'Select a contact'}
                </div>
              </div>

              {dropdownOpen && (
                <div className="absolute top-full mt-1 w-full bg-white border rounded-lg shadow-lg max-h-52 overflow-y-auto z-50">
                  <div className="p-2 sticky top-0 bg-white z-10">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                      <div
                        key={contact.contactId}
                        onClick={() => {
                          setSelectedContact(contact)
                          setDropdownOpen(false)
                        }}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                      >
                        <div className="font-medium text-gray-800">{contact.name}</div>
                        <div className="text-sm text-gray-500">{contact.company}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-600">No contacts found</div>
                  )}
                </div>
              )}
            </div>
{selectedContact && (
  <div className="mt-2 p-4 border rounded-lg bg-gray-50">
    <h3 className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
      <Users className="w-4 h-4 text-blue-500" />
      Client Details
    </h3>
    <div className="text-sm text-gray-600 space-y-1">
      <p><span className="font-medium text-gray-800">Name:</span> {selectedContact.name}</p>
      <p><span className="font-medium text-gray-800">Company:</span> {selectedContact.company}</p>
      <p><span className="font-medium text-gray-800">Contact ID:</span> {selectedContact.contactId}</p>
    </div>
  </div>
)}

            <Button
              onClick={handleAutoOnboard}
              disabled={!selectedContact}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto mt-2"
            >
              <Handshake className="w-4 h-4 mr-2" />
              Onboard Contact
            </Button>
          </div>
        )
      )}
    </div>
  )
}
