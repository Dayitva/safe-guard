import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { WagmiConfig, createClient, configureChains, defaultChains } from 'wagmi'
import { infuraProvider } from '@wagmi/core/providers/infura'
import { getDefaultProvider } from 'ethers'
// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'
import { InjectedConnector } from 'wagmi/connectors/injected'

const { chains, provider } = configureChains(defaultChains, [
  infuraProvider({ apiKey: 'c72c423442fa4e36aaa6a1d45f4a5edb' }),
])

// const connector = new WalletConnectConnector({
//   chains,
//   options: {
//     qrcode: true,
//   },
// })

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector()],
  provider,
})

export default function App({ Component, pageProps }: AppProps) {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <WagmiConfig client={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </WagmiConfig>
  )
}