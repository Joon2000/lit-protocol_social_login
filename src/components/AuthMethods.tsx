import Image from "next/image";

interface AuthMethodProps {
  handleGoogleLogin: () => Promise<void>;
}

const AuthMethods = ({ handleGoogleLogin }: AuthMethodProps) => {
  return (
    <>
      <div className="buttons-container">
        <div className="social-container flex justify-center ">
          <button
            type="button"
            className="btn btn--outline "
            onClick={handleGoogleLogin}
          >
            <div className="w-[87px] h-[28px] btn--inside flex flex-row mt-5 mb-4 border-solid border-2 border-lime-300 rounded-md px-1">
              <div className="w-5 h-5 mx-auto pt-1">
                <Image
                  width={15}
                  height={15}
                  src="/google.png"
                  alt="Google logo"
                />
              </div>
              <span className="text-base font-semibold my-auto">Google</span>
            </div>
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthMethods;
