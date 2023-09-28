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
      <div className=" items-center  font-bold">
        <p className="text-xl">Social Login</p>
        <p className="text-base">using Google Authorization</p>
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
        className="text-xs items-center border-solid border-2 rounded-md border-sky-300 text-blue-500 w-16 m-auto"
      >
        click here
      </button>
    </main>
  );
}
