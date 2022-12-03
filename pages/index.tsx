
import { Button, Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'
import ConnectSafe from '../src/modals/ConnectSafe'
import { useAccount, useConnect } from 'wagmi'
import AllowList from '../src/modals/AllowList'

function Home() {
  const [isConnectSafeModalOpen, setIsConnectSafeModalOpen] = useState(false)
  const onConnectSafeModalClose = async () => {
    setIsConnectSafeModalOpen(false)
  }

  const [isAllowListModalOpen, setIsAllowListModalOpen] = useState(false)
  const onAllowListModalClose = async () => {
    setIsAllowListModalOpen(false)
  }

  const { isConnected, address } = useAccount()

  return <Flex>
    {!isConnected && <Button onClick={() => {
      setIsConnectSafeModalOpen(true)
    }}>
      Open Modal
    </Button>}
    {isConnected && <Text>{address}</Text>}
    <Button onClick={() => {
      setIsAllowListModalOpen(true)
    }}>
      Open Allow List Modal
    </Button>
    <AllowList isOpen={isAllowListModalOpen} onClose={onAllowListModalClose} />
    <ConnectSafe isOpen={isConnectSafeModalOpen} onClose={onConnectSafeModalClose} />
  </Flex>
}

export default Home