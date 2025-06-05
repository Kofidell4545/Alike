import { useCallback } from 'react';
import { useContractRead, useContractWrite, useAccount } from 'wagmi';
import { type Session, type SessionResponse } from '../types/contracts';
import { type Address } from 'viem';
import { contractAddresses } from '../contracts/config';
import AlikeSessionABI from '../contracts/abis/AlikeSession.json';

export const useAlikeSession = () => {
  const { address } = useAccount();

  // Get user's past sessions
  const { data: pastSessions, refetch: refetchPastSessions } = useContractRead({
    address: contractAddresses.AlikeSession,
    abi: AlikeSessionABI.abi,
    functionName: 'getUserSessions',
    args: [address],
    enabled: !!address,
  });

  // Get user's upcoming sessions
  const { data: upcomingSessions, refetch: refetchUpcomingSessions } = useContractRead({
    address: contractAddresses.AlikeSession,
    abi: AlikeSessionABI.abi,
    functionName: 'getUpcomingSessions',
    args: [address],
    enabled: !!address,
  });

  // Book a session
  const { write: bookSession } = useContractWrite({
    address: contractAddresses.AlikeSession,
    abi: AlikeSessionABI.abi,
    functionName: 'bookSession',
  });



  const book = useCallback(async (therapistAddress: Address, timestamp: number) => {
    if (!address) throw new Error('Wallet not connected');

    try {
      if (!bookSession) throw new Error('Failed to book session');
      bookSession({
        args: [therapistAddress, BigInt(timestamp)]
      });
      // Refetch sessions after booking
      await Promise.all([
        refetchPastSessions(),
        refetchUpcomingSessions()
      ]);
    } catch (error) {
      console.error('Error booking session:', error);
      throw error;
    }
  }, [address, bookSession]);

  return {
    pastSessions: pastSessions ? (pastSessions as unknown as SessionResponse[]).map(session => ({
      id: Number(session[0]),
      user: session[1],
      therapist: session[2],
      timestamp: Number(session[3]),
      completed: session[4]
    })) : [],
    upcomingSessions: upcomingSessions ? (upcomingSessions as unknown as SessionResponse[]).map(session => ({
      id: Number(session[0]),
      user: session[1],
      therapist: session[2],
      timestamp: Number(session[3]),
      completed: session[4]
    })) : [],
    bookSession: book
  };
};
