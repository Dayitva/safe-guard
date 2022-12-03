import {
  Text,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Button,
  Image,
} from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { useAccount, useConnect } from 'wagmi'

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

function ConnectSafe({ isOpen, onClose }: Props) {
    const { connector: activeConnector, isConnected, address } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()

  const connector = useMemo(() => {
    return connectors[0]
  }, [connectors])

  useEffect(() => {
    console.log(activeConnector)
    if (activeConnector) onClose()
  }, [activeConnector, onClose])

  const onClick = () => {
    connect({connector})
  }

  return (
    <Modal isCentered={true} isOpen={isOpen} size="3xl" onClose={onClose}>
      <ModalOverlay backdropFilter="blur(12px)" />
      <ModalContent>
        <ModalCloseButton />
        <Flex direction="column" align='center' p={6}>
          <Text fontSize={'24px'} fontWeight='500'>Connect your safe</Text>
          <Text fontSize='14px' lineHeight={'20px'} mt={1}>Connect the safe you want to safeguard to</Text>
          <Button
            leftIcon={<Image alt="wallet-connect" src="/wallet-connect.svg" boxSize="36px" />}
            rightIcon={<Image ml='auto' alt="right-arrow" src="/right-arrow.svg" boxSize="36px" />}
            w="100%"
            h="56px"
            bg="#E8F0F1"
            mt={4}
            onClick={onClick}
          >
            Connect using Wallet Connect
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
}

export default ConnectSafe;
