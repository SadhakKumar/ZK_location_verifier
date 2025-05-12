"use client";

import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains"; // add baseSepolia for testing
import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import LocationVault from "../assets/contracts/LocationVault.json";

const contractContext = createContext(null);

export function useContract() {
  return useContext(contractContext);
}

export function Providers(props) {
  const [contract, setContract] = useState();
  useEffect(() => {
    async function createContract() {
      if (window.ethereum) {
        console.log("window: ", window.ethereum);
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider = new BrowserProvider(window.ethereum); // ✅ Ethers v6
        const signer = await provider.getSigner();
        const contractInstance = new Contract(
          // import.meta.env.VITE_PUBLIC_VAULT_CONTRACT_ADDRESS,
          // "0x5609e6226067d4c425a81CcB9Fd5e1A028ae5ac1",
          "0xfD5169D415a2eD89C2836785734e2dAF36B9225b",
          LocationVault.abi,
          signer
        );
        setContract(contractInstance);
      }
    }
    createContract();
  }, []);
  return (
    <OnchainKitProvider
      apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base} // add baseSepolia for testing
    >
      <contractContext.Provider value={contract}>
        {props.children}
      </contractContext.Provider>
    </OnchainKitProvider>
  );
}
