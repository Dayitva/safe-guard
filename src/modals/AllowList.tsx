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

function AllowList({ isOpen, onClose }: Props) {
    // By default 1 address needs to be there
    const [addresses, setAddresses] = useState<string[]>([''])

    const onContinue = async () => {
        
    }

    return (
        <Modal isCentered={true} isOpen={isOpen} size="2xl" onClose={onClose}>
            <ModalOverlay backdropFilter="blur(12px)" />
            <ModalContent>
                <ModalCloseButton />
                <Flex direction="column" align='center' p={6}>
                    <Image src='/safe-header.svg' w='97px' h='107px' alt='safe-header' />
                    <Text mt={6} fontWeight='500' fontSize={'24px'}>
                        Allow list Guard
                    </Text>
                    <Text fontSize='14px' lineHeight={'20px'} textAlign={'center'} mt={1}>
                        Setup a list of addresses that can be used as the destination in transaction.
                    </Text>

                    <Flex justify={'start'} w='100%'>
                        <Text fontSize='14px' fontWeight={'500'} lineHeight={'20px'} mt={8}>
                            Address
                        </Text>
                    </Flex>

                    {
                        addresses.map((address, index) => {
                            return <Input mt={2} bg='#E8F0F1' placeholder="0x2F05BFDc43e1bAAebdc3D507785fb942eE5c" borderRadius={'4px'} key={address} value={address} onChange={(e) => {
                                const copy = [...addresses]
                                copy[index] = e.target.value
                                setAddresses(copy)
                            }} />
                        })
                    }

                    <Flex justify={'start'} w='100%'>
                        <Button color='black' leftIcon={<Image alt='address-add' src='/add.svg' boxSize={'20px'} />} p={4} variant='link' onClick={() => {
                            setAddresses([...addresses, ''])
                        }}>Add Address</Button>
                    </Flex>

                    <Button mt={4} w='100%' bg='#47C95E' color='white' onClick={onContinue}>
                        Continue
                    </Button>
                </Flex>
            </ModalContent>
        </Modal>
    );
}

export default AllowList;
