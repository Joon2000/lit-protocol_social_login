import Image from "next/image";

interface LoadingProps {
  copy: string;
  error?: Error;
}

export default function Loading({ copy, error }: LoadingProps) {
  return (
    <div className="container">
      <div className="wrapper mt-10">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <div className="loader-container">
          <div className="loader">
            <Image
              src="/네즈코1.gif"
              alt="loading_img"
              width={100}
              height={100}
              className="m-auto"
            />
          </div>
          <p className="text-center mt-5">{copy}</p>
        </div>
      </div>
    </div>
  );
}
