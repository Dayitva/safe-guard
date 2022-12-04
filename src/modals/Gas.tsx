import {
    Text,
    Flex,
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Button,
    Image,
    Input,
    CircularProgress
} from "@chakra-ui/react";
import EthersAdapter from "@safe-global/safe-ethers-lib";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useContract, useSigner } from 'wagmi'
import AllowDeployerABI from "../abis/AllowDeployer.json"
import AllowTransactionGuardABI from "../abis/AllowTransactionGuard.json"
import SafeServiceClient from '@safe-global/safe-service-client'
import { delay } from "../utils/time";
import { ethers } from "ethers"
import Safe from "@safe-global/safe-core-sdk";
import { ALLOW_GUARD_CONTRACT } from "../utils/constants";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function Gas({ isOpen, onClose }: Props) {
    // By default 1 address needs to be there
    const [addresses, setAddresses] = useState<string[]>([''])
    const [safeAddress, setSafeAddress] = useState<string>()
    const [maxGasPrice, setMaxGasPrice] = useState<string>('0.0')
    const [loading, setLoading] = useState(false)
    const { address } = useAccount()
    const { data: signer } = useSigner({
        chainId: 5,
    })
    // const factoryContract = useContract({
    //     address: ALLOW_GUARD_CONTRACT,
    //     // address: '0x0AaFbF1D44bF18e3525c894B7977164e8872f13a',
    //     // abi: AllowDeployerABI,
    //     abi: AllowDeployerABI,
    //     signerOrProvider: signer
    // })

    const onContinue = async () => {
        
    }

    return (
        <Modal isCentered={true} isOpen={isOpen} size="2xl" onClose={onClose}>
            <ModalOverlay backdropFilter="blur(12px)" />
            <ModalContent>
                <ModalCloseButton />
                <Flex direction="column" align='center' p={6}>
                    <Image src='/gas-icon.svg' w='97px' h='107px' alt='safe-header' />
                    <Text mt={6} fontWeight='500' fontSize={'24px'}>
                        Gas Price
                    </Text>
                    <Text fontSize='14px' lineHeight={'20px'} textAlign={'center'} mt={1}>
                        Setup a list of addresses that can be used as the destination in transaction.
                    </Text>

                    <Flex justify={'start'} w='100%' mt={8}>
                        <Text fontSize='14px' fontWeight={'500'} lineHeight={'20px'}>
                            Safe address
                        </Text>
                    </Flex>

                    <Input mt={4} bg='#E8F0F1' placeholder="0x2F05BFDc43e1bAAebdc3D507785fb942eE5c" borderRadius={'4px'} key={safeAddress} value={safeAddress} onChange={(e) => {
                        setSafeAddress(e.target.value)
                    }} />

                    <Flex justify={'start'} w='100%' mt={4}>
                        <Text fontSize='14px' lineHeight={'20px'}>
                            Maximum gas cost (in ETH)
                        </Text>
                    </Flex>

                    <Input mt={2} bg='#E8F0F1' placeholder="0.05 ETH" borderRadius={'4px'} key={safeAddress} value={safeAddress} onChange={(e) => {
                        setMaxGasPrice(e.target.value)
                    }} />

                    <Flex justify={'start'} w='100%' mt={4}>
                        <Text fontSize='14px' fontWeight={'500'} lineHeight={'20px'}>
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
                        <Button disabled={addresses[addresses.length - 1] === ''} color='black' leftIcon={<Image alt='address-add' src='/add.svg' boxSize={'20px'} />} p={4} variant='link' onClick={() => {
                            setAddresses([...addresses, ''])
                        }}>Add Address</Button>
                    </Flex>

                    <Button mt={4} p={loading ? 2 : 0} w='100%' bg='#47C95E' color='white' onClick={onContinue}>
                        {loading ? <CircularProgress color='white' isIndeterminate /> : 'Continue'}
                    </Button>
                </Flex>
            </ModalContent>
        </Modal>
    );
}

export default Gas;
