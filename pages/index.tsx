
import { Button, Flex, Text, Image } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import ConnectSafe from '../src/modals/ConnectSafe'
import { useAccount, useConnect } from 'wagmi'
import AllowList from '../src/modals/AllowList'
import TransactionInitiatedModal from '../src/modals/TransactionInitiated'
import DenyList from '../src/modals/DenyList'
import Gas from '../src/modals/Gas'
import Ephemereal from '../src/modals/Ephemereal'

function Home() {
  const [isConnectSafeModalOpen, setIsConnectSafeModalOpen] = useState(false)
  const onConnectSafeModalClose = async () => {
    setIsConnectSafeModalOpen(false)
  }

  const [isAllowListModalOpen, setIsAllowListModalOpen] = useState(false)
  const onAllowListModalClose = () => {
    setIsAllowListModalOpen(false)
  }

  const [isDenyListModalOpen, setIsDenyListModalOpen] = useState(false)
  const onDenyListModalClose = () => {
    setIsDenyListModalOpen(false)
  }

  const [isGasModalOpen, setIsGasModalOpen] = useState(false)
  const onGasModalClose = () => {
    setIsGasModalOpen(false)
  }

  const [timeLockModalOpen, setTimeLockModalOpen] = useState(false)
  const onTimeLockModalClose = () => {
    setTimeLockModalOpen(false)
  }

  const [isTransactionInitatedModalOpen, setIsTransactionInitiatedModalOpen] = useState(false)
  const onTransactionInitiatedModalClose = async () => {
    setIsTransactionInitiatedModalOpen(false)
  }

  const { isConnected, address } = useAccount()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    console.log(address)
  }, [address])

  const onClick = async (index: number) => {
    if (isConnected) {
      if (index === 0) {
        setIsAllowListModalOpen(true)
      } else if (index === 1) setIsDenyListModalOpen(true)
      else if (index === 2) { setIsGasModalOpen(true) }
      else if (index === 3) setTimeLockModalOpen(true)
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
          <Image src={guard.icon} boxSize='72px' alt={guard.title} />
          <Text fontWeight={'500'} fontSize='20px' mt={6}>
            {guard.title}
          </Text>
          <Text mt={1} textAlign='center'>{guard.subtitle}</Text>
          <Button color='white' mt={6} bg='#47C95E' onClick={() => { onClick(index) }}>Set Guard</Button>
        </Flex>
      })}
    </Flex>
    <AllowList isOpen={isAllowListModalOpen} onClose={onAllowListModalClose} />
    <DenyList isOpen={isDenyListModalOpen} onClose={onDenyListModalClose} />
    <Gas isOpen={isGasModalOpen} onClose={onGasModalClose} />
    <Ephemereal isOpen={timeLockModalOpen} onClose={onTimeLockModalClose} />
    <ConnectSafe isOpen={isConnectSafeModalOpen} onClose={onConnectSafeModalClose} />
    <TransactionInitiatedModal isOpen={isTransactionInitatedModalOpen} onClose={onTransactionInitiatedModalClose} />
  </Flex>
}

const guards = [
  { title: 'Allow List', subtitle: 'Setup a list of addresses that can be used as the destination in transactions.', icon: '/allow-list-icon.svg' },
  { title: 'Deny List', subtitle: 'Setup a list of addresses that can be used as the destination in transactions.', icon: '/deny-list-icon.svg' },
  { title: 'Gas Price', subtitle: 'Allow transactions for a specific gas price range.', icon: '/gas-icon.svg' },
  { title: 'Time lock Safe', subtitle: 'Allow safes to be used within a specific  time period.', icon: '/ephemeral-safe-icon.svg' },
]

export default Home