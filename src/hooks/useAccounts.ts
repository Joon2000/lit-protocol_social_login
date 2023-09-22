import { AuthMethod, IRelayPKP } from "@lit-protocol/types";
import { useCallback, useState } from "react";
import { getPKPs, mintPKP } from "../utils/lit";

export default function useAccounts() {
  const [accounts, setAccounts] = useState<IRelayPKP[]>([]);
  const [currentAccount, setCurrentAccount] = useState<IRelayPKP>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  /**
   * Fetch PKPs tied to given auth method
   */
  const fetchAccounts = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        const myPKPs = await getPKPs(authMethod);
        console.log("fetchAccounts pkps: ", myPKPs);
        setAccounts(myPKPs);
        if (myPKPs.length === 1) {
          setCurrentAccount(myPKPs[0]);
        }
      } catch (err: unknown) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Mint a new PKP for current auth method
   */
  const createAccount = useCallback(
    async (authMethod: AuthMethod): Promise<void> => {
      setLoading(true);
      setError(undefined);
      try {
        const newPKP = await mintPKP(authMethod);
        console.log("createAccount pkp", newPKP);
        setAccounts((prev) => [...prev, newPKP]);
        setCurrentAccount(newPKP);
      } catch (err: unknown) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    fetchAccounts,
    createAccount,
    setCurrentAccount,
    accounts,
    currentAccount,
    loading,
    error,
  };
}
