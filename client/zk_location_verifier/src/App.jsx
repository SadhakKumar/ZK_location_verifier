import { useState } from "react";
import "./App.css";
import { groth16 } from "snarkjs";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useContract } from "./context/Providers";

function App() {
  const [loading, setLoading] = useState(false);
  const contract = useContract();

  const getSomething = async () => {
    const network = await contract.runner.provider.getNetwork();
    console.log("Connected to network:", network);
    console.log(contract);
    const result = await contract.amount();
    console.log(result);
  };
  const sendLocation = async () => {
    setLoading(true);
    const { proof, publicSignals } = await groth16.fullProve(
      {
        latitude: "35", // scaled (19.0000)
        longitude: "69", // scaled (72.0000)
      },
      "/circuits/locationV2.wasm",
      "/circuits/locationV2_0001.zkey"
    );
    console.log("proof: ", proof);
    console.log("publicSignals: ", publicSignals);
    console.log("random test");
    setLoading(false);
  };

  return (
    <>
      <Wallet />
      <button onClick={sendLocation}>click</button>
      <button onClick={getSomething}>click</button>
    </>
  );
}

export default App;
