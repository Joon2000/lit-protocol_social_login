import { IRelayPKP, SessionSigs } from "@lit-protocol/types";
import { useState } from "react";
import { PKPEthersWallet } from "@lit-protocol/pkp-ethers";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";

interface DashBoardProps {
  currentAccount: IRelayPKP;
  sessionSigs: SessionSigs;
}

export default function Dashboard({
  currentAccount,
  sessionSigs,
}: DashBoardProps) {
  const [message, setMessage] = useState<string>("Free the web!");
  const [signature, setSignature] = useState<string>();
  const [recoveredAddress, setRecoveredAddress] = useState<string>();
  const [verified, setVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<Error>();
  const [showFullAddress, setShowFullAddress] = useState<boolean>(false);

  const router = useRouter();

  /**
   * Sign a message with current PKP
   */
  async function signMessageWithPKP() {
    setLoading(true);

    try {
      const pkpWallet = new PKPEthersWallet({
        controllerSessionSigs: sessionSigs,
        pkpPubKey: currentAccount.publicKey,
      });
      await pkpWallet.init();

      const signature = await pkpWallet.signMessage(message);
      setSignature(signature);

      // Get the address associated with the signature created by signing the message
      const recoveredAddr = ethers.utils.verifyMessage(message, signature);
      setRecoveredAddress(recoveredAddr);

      // Check if the address associated with the signature is the same as the current PKP
      const verified =
        currentAccount.ethAddress.toLowerCase() === recoveredAddr.toLowerCase();
      setVerified(verified);
    } catch (err: unknown) {
      console.error(err as Error);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    localStorage.removeItem("lit-wallet-sig");
    router.replace("/");
    console.log("log out");
  }

  return (
    <div className="container">
      <div className="logout-container text-right">
        <button
          className="btn btn-link text-[1px] italic"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <h1 className="text-base font-semibold">Ready for </h1>
      <h1 className="text-xl font-semibold">the open web</h1>
      <div className="details-card">
        <p className="text-sm mt-5">
          My address: <br />
          <p
            className={`text-center cursor-pointer ${
              showFullAddress ? "text-[1px]" : ""
            }`}
            onClick={() => setShowFullAddress((prev) => !prev)}
          >
            {showFullAddress
              ? currentAccount.ethAddress.toLowerCase()
              : currentAccount.ethAddress.toLowerCase().slice(0, 20) + "..."}
          </p>
        </p>
      </div>
      <div className="message-card mt-5">
        <p className=" text-sm">
          Test out your wallet by signing this message:
        </p>
        <form className="flex justify-center">
          <input
            className="mt-2 border-solid border-gray-300 border-[1px] rounded-sm focus: outline-gray-500  w-4/5 h-5 p-1 text-[2px] placeholder:text-gray-400"
            type="text"
            placeholder="Free the web!"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </form>
        <div className="text-center mt-2">
          <button
            onClick={signMessageWithPKP}
            disabled={loading as boolean}
            className={`btn text-xs border-solid border-[2px] rounded-md w-20 ${
              signature
                ? verified
                  ? "btn--success  border-emerald-500"
                  : "btn--error border-red-500"
                : "border-cyan-300"
            } ${loading && "btn--loading border-lime-200 cursor-wait"}`}
          >
            {signature ? (
              verified ? (
                <span>Verified ✓</span>
              ) : (
                <span>Failed x</span>
              )
            ) : loading ? (
              <span>Loading...</span>
            ) : (
              <span>Sign</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
