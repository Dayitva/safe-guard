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

function AllowList({ isOpen, onClose }: Props) {
    // By default 1 address needs to be there
    const [addresses, setAddresses] = useState<string[]>([''])
    const [safeAddress, setSafeAddress] = useState<string>()
    const [loading, setLoading] = useState(false)
    const { address } = useAccount()
    const { data: signer } = useSigner({
        chainId: 5,
    })
    const factoryContract = useContract({
        address: ALLOW_GUARD_CONTRACT,
        // address: '0x0AaFbF1D44bF18e3525c894B7977164e8872f13a',
        // abi: AllowDeployerABI,
        abi: AllowDeployerABI,
        signerOrProvider: signer
    })

    const onContinue = async () => {
        for (const address of addresses) {
            if (address === '') {
                return;
            }
        }
        if (!signer || !address || !safeAddress) {
            return
        }
        localStorage.setItem('allow-safe', safeAddress)

        setLoading(true)
        console.log(address)
        console.log(addresses)
        console.log(factoryContract, signer)
        if (!factoryContract) return

        // console.log(await factoryContract.whitelisted('0x631088Af5A770Bee50FFA7dd5DC18994616DC1fF'))
        // console.log(await factoryContract.whitelisted('0x4e35fF1872A720695a741B00f2fA4D1883440baC'))
        // console.log(await factoryContract.whitelisted('0x4bED464ce9D43758e826cfa173f1cDa82964b894'))

        // return

        const prevCounter = await factoryContract.counter()
        console.log(prevCounter)
        // const safeAddress = '0x92CA6E32B1552F6E5d323f0cA9D87FF482f2207D'
        factoryContract.deploy(addresses, safeAddress)

        while (true) {
            const counter = await factoryContract.counter()
            if (counter > prevCounter) {
                break;
            }
            console.log(counter)

            await delay(5000)
        }

        const counter = await factoryContract.counter()

        const guardContract = await factoryContract.deployedContracts(counter - 1)
        console.log('Guard contract: ', guardContract)

        const ethAdapter = new EthersAdapter({
            ethers,
            signerOrProvider: signer,
        })

        const service = new SafeServiceClient({
            txServiceUrl: 'https://safe-transaction-goerli.safe.global/', // Check https://docs.safe.global/backend/available-services
            ethAdapter
        })

        const safeSdk = await Safe.create({ ethAdapter, safeAddress })
        console.log(await safeSdk.getGuard())
        const safeRet = await safeSdk.createEnableGuardTx(guardContract)
        const safeTxHash = await safeSdk.getTransactionHash(safeRet)
        const senderAddress = await signer.getAddress()
        const signature = await safeSdk.signTransactionHash(safeTxHash)

        console.log('Proposed a transaction with Safe:', safeAddress)
        console.log('- safeTxHash:', safeTxHash)
        console.log('- senderAddress:', senderAddress)
        console.log('- Sender signature:', signature.data)

        await service.proposeTransaction({
            safeAddress,
            safeTransactionData: safeRet.data,
            safeTxHash,
            senderAddress,
            senderSignature: signature.data
        })
        console.log(safeRet)
        setLoading(false)

    }

    return (
        <Modal isCentered={true} isOpen={isOpen} size="2xl" onClose={onClose}>
            <ModalOverlay backdropFilter="blur(12px)" />
            <ModalContent>
                <ModalCloseButton />
                <Flex direction="column" align='center' p={6}>
                    <Image src='/allow-list-icon.svg' w='97px' h='107px' alt='safe-header' />
                    <Text mt={6} fontWeight='500' fontSize={'24px'}>
                        Allow List Guard
                    </Text>
                    <Text fontSize='14px' lineHeight={'20px'} textAlign={'center'} mt={1}>
                        Allow transactions to be sent only to a certain destinations addresses
                    </Text>

                    <Flex justify={'start'} w='100%' mt={8}>
                        <Text fontSize='14px' fontWeight={'500'} lineHeight={'20px'}>
                            Safe address
                        </Text>
                    </Flex>

                    <Input mt={2} bg='#E8F0F1' placeholder="0x2F05BFDc43e1bAAebdc3D507785fb942eE5c" borderRadius={'4px'} key={safeAddress} value={safeAddress} onChange={(e) => {
                        setSafeAddress(e.target.value)
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

export default AllowList;
