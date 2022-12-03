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
import SafeServiceClient from '@safe-global/safe-service-client'
import { delay } from "../utils/time";
import { ethers } from "ethers"
import Safe from "@safe-global/safe-core-sdk";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

function AllowList({ isOpen, onClose }: Props) {
    // By default 1 address needs to be there
    const [addresses, setAddresses] = useState<string[]>([''])
    const [loading, setLoading] = useState(false)
    const { address } = useAccount()
    const { data: signer } = useSigner({
        chainId: 5,
    })
    const factoryContract = useContract({
        address: '0x620386A9e02B8e14B68B55f8E2dD42204A5809ce',
        // address: '0x39865591166a83e8AF6A27B6192B9a7CFB9f3111',
        abi: AllowDeployerABI,
        signerOrProvider: signer
    })

    const onContinue = async () => {
        for (const address of addresses) {
            if (address === '') {
                return;
            }
        }
        if (!signer || !address) {
            return
        }
        setLoading(true)
        console.log(address)
        console.log(addresses)
        console.log(factoryContract, signer)
        if (!factoryContract) return

        const prevCounter = await factoryContract.counter()
        console.log(prevCounter)
        const safeAddress = '0xc84c5bb248edb2645C375cC0e95EA78d412AC77E'
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
                        {loading ? <CircularProgress m={2} color='white' isIndeterminate /> : 'Continue'}
                    </Button>
                </Flex>
            </ModalContent>
        </Modal>
    );
}

export default AllowList;
