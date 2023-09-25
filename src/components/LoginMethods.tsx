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
          <h1>Welcome back</h1>
          <p>Access your lit wallet.</p>
          <AuthMethods handleGoogleLogin={handleGoogleLogin} />
          <div className="buttons-container">
            <button type="button" className="btn btn--link" onClick={signUp}>
              Need an account? Sign up
            </button>
          </div>
        </>
      </div>
    </div>
  );
}
