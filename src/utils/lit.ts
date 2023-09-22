import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {
  LitAuthClient,
  GoogleProvider,
  WebAuthnProvider,
} from "@lit-protocol/lit-auth-client";
import { AuthMethodType, ProviderType } from "@lit-protocol/constants";
import {
  AuthCallbackParams,
  AuthMethod,
  GetSessionSigsProps,
  IRelayPKP,
  SessionSigs,
} from "@lit-protocol/types";

export const ORIGIN = "http://localhost:3000";

export const litNodeClient: LitNodeClient = new LitNodeClient({
  alertWhenUnauthorized: false,
  litNetwork: "serrano",
  debug: false,
});

// Set up LitAuthClient
export const litAuthClient = new LitAuthClient({
  litRelayConfig: {
    // Request a Lit Relay Server API key here: https://forms.gle/RNZYtGYTY9BcD9MEA
    relayApiKey: "test-api-key",
  },
});

/**
 * Redirect to Lit login
 */
export async function signInWithGoogle(redirectUri: string): Promise<void> {
  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  await googleProvider.signIn();
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithGoogle(
  redirectUri: string
): Promise<AuthMethod | undefined> {
  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  const authMethod = await googleProvider.authenticate();
  return authMethod;
}

/**
 * Generate session sigs for given params
 */
export async function getSessionSigs({
  pkpPublicKey,
  authMethod,
  sessionSigsParams,
}: {
  pkpPublicKey: string;
  authMethod: AuthMethod;
  sessionSigsParams: GetSessionSigsProps;
}): Promise<SessionSigs> {
  // const provider = getProviderByAuthMethod(authMethod);
  // if (provider) {
  //   const sessionSigs = await provider.getSessionSigs({
  //     pkpPublicKey,
  //     authMethod,
  //     sessionSigsParams,
  //   });
  //   return sessionSigs;
  // } else {
  //   throw new Error(
  //     `Provider not found for auth method type ${authMethod.authMethodType}`
  //   );
  // }
  await litNodeClient.connect();
  const authNeededCallback = async (params: AuthCallbackParams) => {
    const response = await litNodeClient.signSessionKey({
      statement: params.statement,
      authMethods: [authMethod],
      pkpPublicKey: pkpPublicKey,
      expiration: params.expiration,
      resources: params.resources,
      chainId: 1,
    });
    return response.authSig;
  };

  const sessionSigs = await litNodeClient.getSessionSigs({
    ...sessionSigsParams,
    authNeededCallback,
  });

  return sessionSigs;
}

export async function updateSessionSigs(
  params: GetSessionSigsProps
): Promise<SessionSigs> {
  const sessionSigs = await litNodeClient.getSessionSigs(params);
  return sessionSigs;
}

/**
 * Mint a new PKP for current auth method
 */
export async function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP> {
  const provider = getProviderByAuthMethod(authMethod);

  let txHash: string;

  if (authMethod.authMethodType === AuthMethodType.WebAuthn) {
    // Register new WebAuthn credential
    const options = await (provider as WebAuthnProvider).register();

    // Verify registration and mint PKP through relay server
    txHash = await (
      provider as WebAuthnProvider
    ).verifyAndMintPKPThroughRelayer(options);
  } else {
    // Mint PKP through relay server
    txHash = await provider!.mintPKPThroughRelayer(authMethod);
  }

  const response = await provider!.relay.pollRequestUntilTerminalState(txHash);
  if (response.status !== "Succeeded") {
    throw new Error("Minting failed");
  }
  const newPKP: IRelayPKP = {
    tokenId: response.pkpTokenId!,
    publicKey: response.pkpPublicKey!,
    ethAddress: response.pkpEthAddress!,
  };
  return newPKP;
}

function getProviderByAuthMethod(authMethod: AuthMethod) {
  switch (authMethod.authMethodType) {
    case AuthMethodType.GoogleJwt:
      return litAuthClient.getProvider(ProviderType.Google);
    // case AuthMethodType.Discord:
    //   return litAuthClient.getProvider(ProviderType.Discord);
    // case AuthMethodType.EthWallet:
    //   return litAuthClient.getProvider(ProviderType.EthWallet);
    // case AuthMethodType.WebAuthn:
    //   return litAuthClient.getProvider(ProviderType.WebAuthn);
    // case AuthMethodType.OTP:
    //   return litAuthClient.getProvider(ProviderType.Otp);
    // case AuthMethodType.StytchOtp:
    //   return litAuthClient.getProvider(ProviderType.StytchOtp);
    default:
      return;
  }
}
