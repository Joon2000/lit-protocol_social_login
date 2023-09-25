"use client";

import useAuthenticate from "@/hooks/useAuthenticate";
import useAccounts from "@/hooks/useAccounts";
import { ORIGIN, signInWithGoogle } from "../../utils/lit";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSession from "@/hooks/useSession";
import Loading from "@/components/Loading";
import Dashboard from "@/components/Dashboard";
import SingUpMethods from "@/components/SignUpMethods";

const SignUp = () => {
  const redirectUri = ORIGIN;

  const {
    authMethod,
    loading: authLoading,
    error: authError,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useAuthenticate(redirectUri);

  const {
    createAccount,
    setCurrentAccount,
    currentAccount,
    loading: accountsLoading,
    error: accountsError,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useAccounts();

  const {
    initSession,
    sessionSigs,
    loading: sessionLoading,
    error: sessionError,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useSession();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();

  const error = authError || accountsError || sessionError;

  async function handleGoogleLogin() {
    await signInWithGoogle(redirectUri);
    // SignInWithGoogle을 하면 어떤 일이 일어나는거지??
  }

  useEffect(() => {
    // If user is authenticated, create an account
    if (authMethod) {
      createAccount(authMethod);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authMethod, createAccount]);

  useEffect(() => {
    // If user is authenticated and has at least one account, initialize session
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
    return <Loading copy={"Creating your account..."} error={error} />;
  }

  if (currentAccount && sessionSigs) {
    return (
      <Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs} />
    );
  } else {
    return (
      <SingUpMethods
        handleGoogleLogin={handleGoogleLogin}
        goToLogin={() => router.push("/login")}
        error={error}
      />
    );
  }
};

export default SignUp;
