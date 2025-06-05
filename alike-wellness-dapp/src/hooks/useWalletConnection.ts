import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useDisconnect } from 'wagmi';

export const useWalletConnection = () => {
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleConnection = () => {
    if (isConnected) {
      disconnect();
    } else {
      open();
    }
  };

  return {
    isConnected,
    handleConnection
  };
};
