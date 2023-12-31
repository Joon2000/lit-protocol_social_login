"use client";

import AccountSelection from "@/components/AccountSelection";
import CreateAccounts from "@/components/CreateAccounts";
import LoginMethods from "@/components/LoginMethods";
import Loading from "@/components/Loading";
import useAccounts from "@/hooks/useAccounts";
import useAuthenticate from "@/hooks/useAuthenticate";
import useSession from "@/hooks/useSession";
import { ORIGIN, signInWithGoogle } from "@/utils/lit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Dashboard from "@/components/Dashboard";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function LoginView() {
  const redirectUri = ORIGIN + "/login";

  const {
    authMethod,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);
  const {
    fetchAccounts,
    setCurrentAccount,
    currentAccount,
    accounts,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    initSession,
    sessionSigs,
    loading: sessionLoading,
    error: sessionError,
  } = useSession();
  const router = useRouter();
  const mounted = useIsMounted();

  const error = authError || accountsError || sessionError;

  async function handleGoogleLogin() {
    await signInWithGoogle(redirectUri);
  }

  function goToSignUp() {
    router.push("/signup");
  }

  useEffect(() => {
    // If user is authenticated, fetch accounts
    if (authMethod) {
      fetchAccounts(authMethod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMethod, fetchAccounts]);

  useEffect(() => {
    // If user is authenticated and has selected an account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  if (authLoading) {
    return (
      <Loading copy={"Authenticating your credentials..."} error={error} />
    );
  }

  if (accountsLoading) {
    return <Loading copy={"Looking up your accounts..."} error={error} />;
  }
  if (sessionLoading) {
    return <Loading copy={"Securing your session..."} error={error} />;
  }

  // If user is authenticated and has selected an account, initialize session
  if (currentAccount && sessionSigs) {
    return (
      <Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs} />
    );
  }

  // If user is authenticated and has selected an account, initialize session
  if (authMethod && accounts.length > 0) {
    return (
      <AccountSelection
        accounts={accounts}
        setCurrentAccount={setCurrentAccount}
        error={error as Error}
      />
    );
  }

  // If user is authenticated but has no accounts, prompt to create an account
  if (authMethod && accounts.length === 0) {
    return <CreateAccounts signUp={goToSignUp} error={error} />;
  }

  // If user is not authenticated, show login methods
  return (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    mounted && (
      <LoginMethods
        handleGoogleLogin={handleGoogleLogin}
        signUp={goToSignUp}
        error={error}
      />
    )
  );
}
