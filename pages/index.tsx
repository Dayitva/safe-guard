
import { Button, Flex, Text, Image } from '@chakra-ui/react'
import { useEffect, useMemo, useState } from 'react'
import ConnectSafe from '../src/modals/ConnectSafe'
import { useAccount, useConnect, useProvider, useSigner } from 'wagmi'
import AllowList from '../src/modals/AllowList'
import TransactionInitiatedModal from '../src/modals/TransactionInitiated'
import DenyList from '../src/modals/DenyList'
import Gas from '../src/modals/Gas'
import Ephemereal from '../src/modals/Ephemereal'
import EthersAdapter from '@safe-global/safe-ethers-lib'
import { ethers } from 'ethers'
import SafeServiceClient from '@safe-global/safe-service-client'
import Safe from '@safe-global/safe-core-sdk'
import { RepeatIcon } from '@chakra-ui/icons'

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

  const [areGuardsSet, setAreGuardsSet] = useState<boolean[]>([false, false, false, false])
  const {data: signer} = useSigner({chainId: 5})

  const isGuardSetForSafe = async (safeAddress: string) => {
    console.log(signer)
    if (!signer) {
      connect({connector: connectors[0]})
      return false
    }
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer,
    })

    console.log(ethAdapter, safeAddress)
    const safeSdk = await Safe.create({ ethAdapter, safeAddress })
    const guardAddress = await safeSdk.getGuard()
    console.log('Guard address for safe: ', safeAddress, 'is: ', guardAddress)
    return guardAddress !== '0x0000000000000000000000000000000000000000'
  }

  const isGuardSet = async (index: number) => {
    if (index === 0) {
      const allowSafe = localStorage.getItem('allow-safe')
      console.log('Allow Safe: ', allowSafe)
      if (allowSafe) {
        const copy = [...areGuardsSet]
        copy[index] = await isGuardSetForSafe(allowSafe)
        setAreGuardsSet(copy)
      }
    } else if (index === 1) {
      const denySafe = localStorage.getItem('deny-safe')
      console.log('Deny safe: ', denySafe)
      if (denySafe) {
        const copy = [...areGuardsSet]
        copy[index] = await isGuardSetForSafe(denySafe)
        setAreGuardsSet(copy)
      }
    } else return false
  }

  return <Flex direction='column' align='center' bg='#EEF0F2' h='100vh' p={8}>
    <Text fontWeight={'700'} fontSize='44px'>
       SafeGuard
    </Text>
    <Text mt={8} fontWeight='400' fontSize={'28px'}>
      Customisable On-Chain Financial Controllers For Your Safes
    </Text>
    <Flex justify={'center'} w='100%'>
      <Text mt={10} fontWeight='700' fontSize={'24px'}>
        Available Guards
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
          <Flex align='center' mt={6}>
            <Button disabled={areGuardsSet[index]} color='white' bg='#47C95E' onClick={() => { onClick(index) }}>Set Guard</Button>
            {!areGuardsSet[index] && <RepeatIcon ml={2} cursor={'pointer'} onClick={() => {
              isGuardSet(index)
            }} />}
          </Flex>

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
  { title: 'Allow List', subtitle: 'Allow transactions to be sent only to a certain destinations addresses', icon: '/allow-list-icon.svg' },
  { title: 'Deny List', subtitle: 'Setup a list of addresses that cannot be used as the destination in transactions.', icon: '/deny-list-icon.svg' },
  { title: 'Gas Volatility', subtitle: 'Allow transactions to execute only within a specific gas price range.', icon: '/gas-icon.svg' },
  { title: 'Time Lock', subtitle: 'Manage access control for the safes for only a specific time period.', icon: '/ephemeral-safe-icon.svg' },
]

export default Home