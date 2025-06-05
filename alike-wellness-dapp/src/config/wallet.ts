import { createConfig, http } from 'wagmi'
import { sapphireTestnet } from 'viem/chains'
import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

export const projectId = "6fc19c5afc08ff8031609adeed7df315"

const metadata = {
  name: 'Alike Wellness',
  description: 'Your Mental Health Journey, Private & Secure',
  url: 'https://alike-wellness.windsurf.build',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = defaultWagmiConfig({
  projectId,
  chains: [sapphireTestnet],
  metadata,
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#3B82F6',
  },
  chains: [sapphireTestnet],
  metadata
})
