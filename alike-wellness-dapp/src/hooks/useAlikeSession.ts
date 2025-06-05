import { useCallback } from 'react';
import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { type Session, type SessionResponse } from '../types/contracts';
import { type Address } from 'viem';
import { contractAddresses } from '../contracts/config';
import AlikeSessionABI from '../contracts/abis/AlikeSession.json';

export const useAlikeSession = () => {
  const { address } = useAccount();

  // Get user's past sessions
  const { data: pastSessions } = useContractRead({
    address: contractAddresses.AlikeSession,
    abi: AlikeSessionABI.abi,
    functionName: 'getUserSessions',
    args: [address],
    enabled: !!address,
  });

  // Get user's upcoming sessions
  const { data: upcomingSessions } = useContractRead({
    address: contractAddresses.AlikeSession,
    abi: AlikeSessionABI.abi,
    functionName: 'getUpcomingSessions',
    args: [address],
    enabled: !!address,
  });

  // Book a session
  const { writeAsync: bookSession } = useContractWrite({
    address: contractAddresses.AlikeSession,
    abi: AlikeSessionABI.abi,
    functionName: 'bookSession',
  });

  const book = useCallback(async (therapistAddress: string, timestamp: number) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      if (!bookSession) throw new Error('Failed to book session');
      const tx = await bookSession({ args: [therapistAddress, timestamp] });
      await tx.wait();
      return tx;
    } catch (error) {
      console.error('Error booking session:', error);
      throw error;
    }
  }, [address, bookSession]);

  return {
    pastSessions: (pastSessions as SessionResponse[] | undefined)?.map(session => ({
      id: Number(session[0]),
      user: session[1],
      therapist: session[2],
      timestamp: Number(session[3]),
      completed: session[4]
    })) || [],
    upcomingSessions: (upcomingSessions as SessionResponse[] | undefined)?.map(session => ({
      id: Number(session[0]),
      user: session[1],
      therapist: session[2],
      timestamp: Number(session[3]),
      completed: session[4]
    })) || [],
    bookSession: book
  };
};
