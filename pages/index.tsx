
import { Button, Flex , Text } from '@chakra-ui/react'
import { useState } from 'react' 
import ConnectSafe from '../src/modals/ConnectSafe'
import { useAccount, useConnect } from 'wagmi'

function Home() {
  const [isOpen, setIsOpen] = useState(false)
  const onClose = async () => {
    setIsOpen(false)
  }

  const { isConnected, address } = useAccount()

  return <Flex>
    {!isConnected && <Button onClick={() => {
      setIsOpen(true)
    }}>
      Open Modal
    </Button>}
    {isConnected && <Text>{address}</Text>}
    <ConnectSafe isOpen={isOpen} onClose={onClose} />
  </Flex>
}

export default Home