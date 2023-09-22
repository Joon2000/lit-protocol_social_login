"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  function handleClick() {
    router.push("/login");
  }

  return (
    <main className="main-container flex flex-col justify-center gap-y-10">
      <div className="text-base items-center">
        <p>Hello</p>
        <p>Mint a PKP</p>
        <p>using Google authorization</p>
      </div>
      <Image
        src="/네즈코3.gif"
        alt="home_img"
        width={100}
        height={100}
        className="m-auto"
      />
      <button
        onClick={handleClick}
        className="text-sm items-center border-solid border-black rounded text-blue-500 w-14 m-auto"
      >
        click here
      </button>
    </main>
  );
}
