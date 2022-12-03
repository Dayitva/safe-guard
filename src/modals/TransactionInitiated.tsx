import {
    Text,
    Flex,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Button,
    Image,
    Input
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect } from 'wagmi'

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function TransactionInitiatedModal({ isOpen, onClose }: Props) {
    // By default 1 address needs to be there
    const [addresses, setAddresses] = useState<string[]>([''])

    const onContinue = async () => {

    }

    return (
        <Modal isCentered={true} isOpen={isOpen} size="2xl" onClose={onClose}>
            <ModalOverlay backdropFilter="blur(12px)" />
            <ModalContent>
                <ModalCloseButton />
                <Flex direction="column" p={6}>
                    <Text mt={6} fontWeight='500' fontSize={'24px'}>
                        Transaction Initiated
                    </Text>

                    <Flex justify={'start'} fontSize='14px' lineHeight={'20px'} w='100%'>
                        <Text fontSize='14px' fontWeight={'500'} lineHeight={'20px'} mt={8}>
                            Here’s what you can do next:
                        </Text>
                    </Flex>

                    {
                        details.map((detail, index) => {
                            return <Flex mt={6} key={index} align='center'>
                                <Text bg='#47C95E' p={1}>
                                    {index}
                                </Text>
                                <Text ml={2} fontSize='14px' fontWeight={'500'} lineHeight={'20px'}>
                                    {detail}
                                </Text>
                            </Flex>
                        })
                    }

                    <Button mt={4} w='100%' bg='#47C95E' color='white' onClick={onContinue}>
                        Open Multisig
                    </Button>
                </Flex>
            </ModalContent>
        </Modal>
    );
}

const details = ['Open your multisig.', 'Confirm the transaction by voting on the proposal.', 'Notify other owners on the Safe to confirm the transaction on the proposal.']

export default TransactionInitiatedModal
