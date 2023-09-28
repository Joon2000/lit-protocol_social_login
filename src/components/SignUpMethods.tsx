/* eslint-disable react/no-unescaped-entities */
import AuthMethods from "./AuthMethods";

interface SignUpProps {
  handleGoogleLogin: () => Promise<void>;
  goToLogin: any;
  error?: Error;
}

export default function SingUpMethods({
  handleGoogleLogin,
  goToLogin,
  error,
}: SignUpProps) {
  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <>
          <h1 className="text-xl font-semibold">Get started</h1>
          <p className="text-sm mt-2">
            Create a wallet that is secured by accounts you already have.
            Lit-powered MPC wallets, you won't have to worry about seed phrases
            or browser extensions.
          </p>
          <AuthMethods handleGoogleLogin={handleGoogleLogin} />
          <div className="login-container flex flex-row mt-10">
            <div className="text-sm">Have an account?</div>
            <div
              onClick={goToLogin}
              className="ml-2 text-sky-300 text-sm cursor-pointer italic"
            >
              Log in
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
