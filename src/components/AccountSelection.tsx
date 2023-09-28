import * as RadioGroup from "@radix-ui/react-radio-group";

import { IRelayPKP } from "@lit-protocol/types";
import { useState } from "react";

interface AccountSelectionProps {
  accounts: IRelayPKP[];
  setCurrentAccount: any;
  error: Error;
}

export default function AccountSelection({
  accounts,
  setCurrentAccount,
  error,
}: AccountSelectionProps) {
  const [selectedValue, setSelectedValue] = useState<string>("0");

  async function handleSubmit(event: any) {
    event.preventDefault();
    const account = accounts[parseInt(selectedValue)];
    return setCurrentAccount(account);
  }

  return (
    <div className="container">
      <div className="wrapper">
        {error && (
          <div className="alert alert--error">
            <p>{error.message}</p>
          </div>
        )}
        <h1 className="text-2xl font-bold">Choose your account</h1>
        <p className="text-base font-semibold mt-2 leading-4 mb-3">
          Continue with one of your accounts
        </p>
        <form onSubmit={handleSubmit} className="form">
          <RadioGroup.Root
            className="flex flex-col gap-2.5"
            defaultValue="0"
            onValueChange={setSelectedValue}
            aria-label="View density"
          >
            {accounts.map((account, index) => (
              <div key={index}>
                <RadioGroup.Item
                  value={index.toString()}
                  className="bg-white w-[10px] h-[10px] rounded-full border-solid border-[1px] border-gray-300"
                >
                  {index.toString() === selectedValue && (
                    <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative after:content-[''] after:block after:w-[5px] after:h-[5px] after:rounded-[50%] after:bg-black " />
                  )}
                </RadioGroup.Item>
                <label className="ml-1.5">
                  {account.ethAddress.toLowerCase().slice(0, 20)}...
                </label>
              </div>
            ))}
          </RadioGroup.Root>
          <div className="button-container flex justify-center">
            <button
              type="submit"
              className="btn btn-primary border-solid border-2 border-lime-300 rounded-md px-1 mt-5"
            >
              <div className="text-xs font-semibold ">Continue</div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
