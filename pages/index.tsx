
import { Button, Flex, Text, Image } from '@chakra-ui/react'
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

  const [isTransactionInitatedModalOpen, setIsTransactionInitiatedModalOpen] = useState(false)
  const onTransactionInitiatedModalClose = async () => {
    setIsTransactionInitiatedModalOpen(false)
  }

  const { connector: activeConnector, isConnected, address } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()

  const onAllowList = async () => {
    if (isConnected) {
      setIsAllowListModalOpen(true)
    } else {
      connect({ connector: connectors[0] })
    }
  }

  return <Flex direction='column' align='center' bg='#EEF0F2' h='100vh' p={8}>
    <Text fontWeight={'700'} fontSize='44px'>
      Setup financial guards on your Gnosis Safe
    </Text>
    <Text mt={8}>
      Financial guards allow you to safeguard your assets and enhance experience on your Gnosis safe.
    </Text>
    <Flex justify={'start'} w='100%'>
      <Text mt={10} fontWeight='700' fontSize={'24px'}>
      Guards
      </Text>
    </Flex>
    <Flex mt={4}>
        {guards.map((guard, index) => {
          return <Flex flex={1} mx={4} align='center' direction='column' key={index} borderRadius={'8px'} boxShadow='0px 0px 12px rgba(0, 0, 0, 0.1)' bg='white' p={8}>
            <Image src={guard.icon} boxSize='72px' alt={guard.title}/>
            <Text fontWeight={'500'} fontSize='20px' mt={6}>
              {guard.title}
            </Text>
            <Text mt={1} textAlign='center'>{guard.subtitle}</Text>
            <Button color='white' mt={6} bg='#47C95E' onClick={onAllowList}>Set Guard</Button>
          </Flex>
        })}
      </Flex>
    <AllowList isOpen={isAllowListModalOpen} onClose={onAllowListModalClose} />
    <ConnectSafe isOpen={isConnectSafeModalOpen} onClose={onConnectSafeModalClose} />
    <TransactionInitiatedModal isOpen={isTransactionInitatedModalOpen} onClose={onTransactionInitiatedModalClose} />
  </Flex>
}

const guards = [
  {title: 'Allow List', subtitle: 'Setup a list of addresses that can be used as the destination in transactions.', icon: '/allow-list-icon.svg'},
  {title: 'Deny List', subtitle: 'Setup a list of addresses that can be used as the destination in transactions.', icon: '/deny-list-icon.svg'},
  {title: 'Gas Price', subtitle: 'Allow transactions for a specific gas price range.', icon: '/gas-icon.svg'},
  {title: 'Ephemereal Safe', subtitle: 'Allow safes to be used within a specific  time period.', icon: '/ephemeral-safe-icon.svg'},
]

export default Home