export const contractAddresses = {
  // Oasis Sapphire Testnet
  AlikeUser: '0x...',    // Replace with actual deployed address
  AlikeSession: '0x...', // Replace with actual deployed address
  AlikeForum: '0x...',   // Replace with actual deployed address
} as const;

export const chainConfig = {
  id: 23295, // Oasis Sapphire Testnet
  name: 'Oasis Sapphire Testnet',
  network: 'sapphire-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'TEST',
    symbol: 'TEST',
  },
  rpcUrls: {
    public: { http: ['https://testnet.sapphire.oasis.dev'] },
    default: { http: ['https://testnet.sapphire.oasis.dev'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://testnet.explorer.sapphire.oasis.dev' },
  },
} as const;
