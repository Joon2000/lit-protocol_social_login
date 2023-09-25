import Image from "next/image";

interface AuthMethodProps {
  handleGoogleLogin: () => Promise<void>;
}

const AuthMethods = ({ handleGoogleLogin }: AuthMethodProps) => {
  return (
    <>
      <div className="buttons-container">
        <div className="social-container">
          <button
            type="button"
            className="btn btn--outline"
            onClick={handleGoogleLogin}
          >
            <div className="btn__icon">
              <Image
                width={50}
                height={50}
                src="/google.png"
                alt="Google logo"
              />
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthMethods;
