import { useCallback, useEffect, useState } from "react";

import { AuthMethod } from "@lit-protocol/types";
import { authenticateWithGoogle } from "@/utils/lit";
import {
  getProviderFromUrl,
  isSignInRedirect,
} from "@lit-protocol/lit-auth-client";

export default function useAuthenticate(redirectUri?: string) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  /**
   * Handle redirect from Google OAuth
   */
  const authWithGoogle = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    setAuthMethod(undefined);

    try {
      const result: AuthMethod = (await authenticateWithGoogle(
        redirectUri as any
      )) as any;
      setAuthMethod(result);
    } catch (err: unknown) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [redirectUri]);

  useEffect(() => {
    if (redirectUri && isSignInRedirect(redirectUri)) {
      const providerName = getProviderFromUrl();
      if (providerName === "google") {
        authWithGoogle();
      }
    }
  }, [redirectUri, authWithGoogle]);

  return {
    authMethod,
    loading,
    error,
  };
}
