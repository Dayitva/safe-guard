
import { Button, Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'
import ConnectSafe from '../src/modals/ConnectSafe'
import { useAccount, useConnect } from 'wagmi'
import AllowList from '../src/modals/AllowList'
import TransactionInitiatedModal from '../src/modals/TransactionInitiated'

function Home() {
  const [isConnectSafeModalOpen, setIsConnectSafeModalOpen] = useState(false)
  const onConnectSafeModalClose = async () => {
    setIsConnectSafeModalOpen(false)
  }

  const [isAllowListModalOpen, setIsAllowListModalOpen] = useState(false)
  const onAllowListModalClose = async () => {
    setIsAllowListModalOpen(false)
  }

  const [isTransactionInitatedModalOpen, setIsTransactionInitiatedModalOpen] = useState(true)
  const onTransactionInitiatedModalClose = async () => {
    setIsTransactionInitiatedModalOpen(false)
  }

  const { isConnected, address } = useAccount()

  return <Flex>
    <AllowList isOpen={isAllowListModalOpen} onClose={onAllowListModalClose} />
    <ConnectSafe isOpen={isConnectSafeModalOpen} onClose={onConnectSafeModalClose} />
    <TransactionInitiatedModal isOpen={isTransactionInitatedModalOpen} onClose={onTransactionInitiatedModalClose} />
  </Flex>
}

export default Home