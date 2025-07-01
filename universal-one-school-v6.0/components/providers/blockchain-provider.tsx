'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
// Temporarily removing auth dependency until auth system is properly aligned
// import { useAuth } from '@/hooks/use-auth'

interface BlockchainAchievement {
  id: string
  title: string
  description: string
  category: 'academic' | 'social' | 'creative' | 'leadership' | 'technical'
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary'
  school_type: 'superhero' | 'stage-prep' | 'law' | 'language' | 'cross-school'
  criteria: {
    points_required: number
    skills_demonstrated: string[]
    time_requirement?: string
    special_conditions?: string[]
  }
  nft_metadata: {
    token_id?: string
    contract_address?: string
    blockchain: 'ethereum' | 'polygon' | 'educational-chain'
    image_url: string
    attributes: Array<{
      trait_type: string
      value: string | number
    }>
  }
  earned_date?: string
  verification_status: 'pending' | 'verified' | 'minted' | 'transferred'
}

interface StudentRecord {
  student_id: string
  achievements: BlockchainAchievement[]
  total_points: number
  current_level: string
  transcript_hash: string
  verification_signatures: Array<{
    authority: string
    signature: string
    timestamp: string
  }>
  portable_record_url: string
}

interface BlockchainContextType {
  studentRecord: StudentRecord | null
  availableAchievements: BlockchainAchievement[]
  earnedAchievements: BlockchainAchievement[]
  mintAchievement: (achievementId: string) => Promise<void>
  transferRecord: (targetWallet: string) => Promise<string>
  verifyAchievement: (tokenId: string) => Promise<boolean>
  generateTranscript: () => Promise<string>
  connectWallet: () => Promise<void>
  walletConnected: boolean
  walletAddress: string | null
  blockchainMetrics: {
    total_nfts_minted: number
    verification_score: number
    record_completeness: number
  }
}

const BlockchainContext = createContext<BlockchainContextType | null>(null)

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const { user, hasFeatureAccess } = useAuth()
  const [studentRecord, setStudentRecord] = useState<StudentRecord | null>(null)
  const [availableAchievements, setAvailableAchievements] = useState<BlockchainAchievement[]>([])
  const [earnedAchievements, setEarnedAchievements] = useState<BlockchainAchievement[]>([])
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [blockchainMetrics, setBlockchainMetrics] = useState({
    total_nfts_minted: 0,
    verification_score: 0,
    record_completeness: 0
  })

  // Initialize blockchain features
  useEffect(() => {
    const initializeBlockchain = async () => {
      if (!user || !hasFeatureAccess('achievements_nft')) return

      try {
        // Load student's blockchain record
        const recordResponse = await fetch('/api/blockchain/student-record', {
          credentials: 'include'
        })

        if (recordResponse.ok) {
          const record = await recordResponse.json()
          setStudentRecord(record)
          setEarnedAchievements(record.achievements)
        }

        // Load available achievements for student's school
        const achievementsResponse = await fetch('/api/blockchain/achievements/available', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            school_type: user.school,
            grade: user.grade,
            enrollment_type: user.enrollmentType
          })
        })

        if (achievementsResponse.ok) {
          const achievements = await achievementsResponse.json()
          setAvailableAchievements(achievements)
        }

        // Load blockchain metrics
        const metricsResponse = await fetch('/api/blockchain/metrics', {
          credentials: 'include'
        })

        if (metricsResponse.ok) {
          const metrics = await metricsResponse.json()
          setBlockchainMetrics(metrics)
        }

      } catch (error) {
        console.error('Blockchain initialization failed:', error)
      }
    }

    initializeBlockchain()
  }, [user, hasFeatureAccess])

  // Check for Web3 wallet connection
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window === 'undefined' || !window.ethereum) return

      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        })

        if (accounts.length > 0) {
          setWalletConnected(true)
          setWalletAddress(accounts[0])
        }
      } catch (error) {
        console.error('Wallet connection check failed:', error)
      }
    }

    checkWalletConnection()
  }, [])

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask or Web3 wallet not found')
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })

      if (accounts.length > 0) {
        setWalletConnected(true)
        setWalletAddress(accounts[0])

        // Link wallet to student account
        await fetch('/api/blockchain/wallet/link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            wallet_address: accounts[0]
          })
        })
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      throw error
    }
  }

  const mintAchievement = async (achievementId: string) => {
    if (!walletConnected || !walletAddress) {
      throw new Error('Wallet not connected')
    }

    try {
      const achievement = availableAchievements.find(a => a.id === achievementId)
      if (!achievement) {
        throw new Error('Achievement not found')
      }

      // Check if student meets criteria
      const eligibilityResponse = await fetch('/api/blockchain/achievements/check-eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          achievement_id: achievementId
        })
      })

      const eligibility = await eligibilityResponse.json()
      if (!eligibility.eligible) {
        throw new Error(`Not eligible: ${eligibility.reason}`)
      }

      // Mint NFT achievement
      const mintResponse = await fetch('/api/blockchain/achievements/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          achievement_id: achievementId,
          wallet_address: walletAddress,
          verification_data: eligibility.verification_data
        })
      })

      if (!mintResponse.ok) {
        throw new Error('NFT minting failed')
      }

      const mintResult = await mintResponse.json()
      
      // Update local state
      const updatedAchievement: BlockchainAchievement = {
        ...achievement,
        earned_date: new Date().toISOString(),
        verification_status: 'minted',
        nft_metadata: {
          ...achievement.nft_metadata,
          token_id: mintResult.token_id,
          contract_address: mintResult.contract_address
        }
      }

      setEarnedAchievements(prev => [...prev, updatedAchievement])

      // Update metrics
      setBlockchainMetrics(prev => ({
        ...prev,
        total_nfts_minted: prev.total_nfts_minted + 1
      }))

    } catch (error) {
      console.error('Achievement minting failed:', error)
      throw error
    }
  }

  const transferRecord = async (targetWallet: string): Promise<string> => {
    if (!walletConnected || !studentRecord) {
      throw new Error('Wallet not connected or no student record')
    }

    try {
      const response = await fetch('/api/blockchain/records/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          target_wallet: targetWallet,
          include_achievements: true,
          include_transcript: true
        })
      })

      if (!response.ok) {
        throw new Error('Record transfer failed')
      }

      const result = await response.json()
      return result.transaction_hash

    } catch (error) {
      console.error('Record transfer failed:', error)
      throw error
    }
  }

  const verifyAchievement = async (tokenId: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/blockchain/achievements/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          token_id: tokenId
        })
      })

      if (!response.ok) {
        return false
      }

      const verification = await response.json()
      return verification.valid

    } catch (error) {
      console.error('Achievement verification failed:', error)
      return false
    }
  }

  const generateTranscript = async (): Promise<string> => {
    try {
      const response = await fetch('/api/blockchain/transcript/generate', {
        method: 'POST',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Transcript generation failed')
      }

      const result = await response.json()
      return result.transcript_url

    } catch (error) {
      console.error('Transcript generation failed:', error)
      throw error
    }
  }

  const value = {
    studentRecord,
    availableAchievements,
    earnedAchievements,
    mintAchievement,
    transferRecord,
    verifyAchievement,
    generateTranscript,
    connectWallet,
    walletConnected,
    walletAddress,
    blockchainMetrics
  }

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  )
}

export function useBlockchain() {
  const context = useContext(BlockchainContext)
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider')
  }
  return context
}

// Achievement Gallery Component
export function AchievementGallery() {
  const { earnedAchievements, availableAchievements, mintAchievement, walletConnected, connectWallet } = useBlockchain()
  const { hasFeatureAccess } = useAuth()

  if (!hasFeatureAccess('achievements_nft')) {
    return (
      <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-6 text-center">
        <h3 className="text-yellow-400 font-bold mb-2">NFT Achievements Available</h3>
        <p className="text-gray-300 mb-4">Upgrade to VR Premium or AI Enhanced to earn blockchain-verified certificates</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {!walletConnected && (
        <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6 text-center">
          <h3 className="text-blue-400 font-bold mb-2">Connect Your Wallet</h3>
          <p className="text-gray-300 mb-4">Connect a Web3 wallet to mint and manage your NFT achievements</p>
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Earned Achievements */}
        {earnedAchievements.map((achievement) => (
          <div key={achievement.id} className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border border-green-500 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-green-400 font-bold">{achievement.title}</h3>
              <span className={`px-2 py-1 rounded text-xs ${getLevelColor(achievement.level)}`}>
                {achievement.level.toUpperCase()}
              </span>
            </div>
            
            <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>
            
            <div className="bg-black/40 rounded-lg p-3 mb-4">
              <img 
                src={achievement.nft_metadata.image_url} 
                alt={achievement.title}
                className="w-full h-32 object-cover rounded"
              />
            </div>

            <div className="text-xs text-gray-400">
              <div>Earned: {new Date(achievement.earned_date!).toLocaleDateString()}</div>
              {achievement.nft_metadata.token_id && (
                <div>Token ID: {achievement.nft_metadata.token_id}</div>
              )}
            </div>
          </div>
        ))}

        {/* Available Achievements */}
        {availableAchievements
          .filter(a => !earnedAchievements.find(e => e.id === a.id))
          .map((achievement) => (
          <div key={achievement.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-400 font-bold">{achievement.title}</h3>
              <span className={`px-2 py-1 rounded text-xs ${getLevelColor(achievement.level)} opacity-60`}>
                {achievement.level.toUpperCase()}
              </span>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">{achievement.description}</p>
            
            <div className="bg-black/40 rounded-lg p-3 mb-4 opacity-60">
              <img 
                src={achievement.nft_metadata.image_url} 
                alt={achievement.title}
                className="w-full h-32 object-cover rounded grayscale"
              />
            </div>

            <div className="space-y-2 mb-4">
              <div className="text-xs text-gray-500">Requirements:</div>
              <div className="text-xs text-gray-400">
                Points needed: {achievement.criteria.points_required}
              </div>
              {achievement.criteria.skills_demonstrated.map((skill, index) => (
                <div key={index} className="text-xs text-gray-400">• {skill}</div>
              ))}
            </div>

            {walletConnected && (
              <button
                onClick={() => mintAchievement(achievement.id)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Check & Mint
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Blockchain Status Component
export function BlockchainStatus() {
  const { walletConnected, walletAddress, blockchainMetrics } = useBlockchain()

  return (
    <div className="bg-black/90 border border-purple-500 rounded-lg p-4 text-purple-400">
      <h3 className="font-bold mb-3">Blockchain Status</h3>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Wallet:</span>
          <span className={walletConnected ? 'text-green-400' : 'text-red-400'}>
            {walletConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        {walletAddress && (
          <div className="flex justify-between">
            <span>Address:</span>
            <span className="text-cyan-400 font-mono text-xs">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span>NFTs Minted:</span>
          <span className="text-yellow-400">{blockchainMetrics.total_nfts_minted}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Verification Score:</span>
          <span className="text-green-400">{Math.round(blockchainMetrics.verification_score * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

function getLevelColor(level: string): string {
  const colors = {
    bronze: 'bg-orange-700 text-orange-300',
    silver: 'bg-gray-600 text-gray-200',
    gold: 'bg-yellow-600 text-yellow-200',
    platinum: 'bg-purple-600 text-purple-200',
    legendary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
  }
  return colors[level as keyof typeof colors] || colors.bronze
}