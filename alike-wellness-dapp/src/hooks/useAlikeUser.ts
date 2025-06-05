import { useCallback } from 'react';
import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { type UserDetails, type UserResponse } from '../types/contracts';
import { type Address } from 'viem';
import { contractAddresses } from '../contracts/config';
import AlikeUserABI from '../contracts/abis/AlikeUser.json';

export const useAlikeUser = () => {
  const { address } = useAccount();

  // Check if user is registered
  const { data: isRegistered, refetch: refetchRegistration } = useContractRead({
    address: contractAddresses.AlikeUser,
    abi: AlikeUserABI.abi,
    functionName: 'isRegistered',
    args: [address],
    enabled: !!address,
  });

  // Get user details
  const { data: userDetails, refetch: refetchDetails } = useContractRead({
    address: contractAddresses.AlikeUser,
    abi: AlikeUserABI.abi,
    functionName: 'users',
    args: [address],
    enabled: !!address && isRegistered,
  });

  // Register user
  const { write: register } = useContractWrite({
    address: contractAddresses.AlikeUser,
    abi: AlikeUserABI.abi,
    functionName: 'registerUser',
  });

  const registerUser = useCallback(async () => {
    if (!address) throw new Error('Wallet not connected');
    if (isRegistered) throw new Error('User already registered');

    try {
      if (!register || !address) throw new Error('Failed to register');
      // Use first 6 characters of wallet address as username
      const username = `user_${address.slice(2, 8)}`;
      register({ args: [username] });
      // Refetch user data
      await Promise.all([
        refetchRegistration(),
        refetchDetails()
      ]);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }, [address, isRegistered, register]);

  return {
    isRegistered: !!isRegistered,
    userDetails: userDetails ? (userDetails as UserResponse) : null,
    registerUser
  };
};
