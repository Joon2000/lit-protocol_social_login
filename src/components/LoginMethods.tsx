import AuthMethods from "./AuthMethods";

interface LoginProps {
  handleGoogleLogin: () => Promise<void>;
  signUp: any;
  error?: Error;
}

export default function LoginMethods({
  handleGoogleLogin,
  signUp,
  error,
}: LoginProps) {
  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <>
          <h1 className="text-2xl font-bold mb-8">Welcome back!</h1>
          <p>Access your lit wallet.</p>
          <AuthMethods handleGoogleLogin={handleGoogleLogin} />
          <div className="sign-up__container flex flex-row mt-10">
            <p className="text-sm">Need an account? </p>
            <div className="buttons-container">
              <div
                className="ml-2 text-sky-300 text-sm cursor-pointer italic"
                onClick={signUp}
              >
                Sign up
              </div>
            </div>
          </div>
        </>
      </div>
    </div>
  );
}
