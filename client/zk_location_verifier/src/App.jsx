import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { groth16 } from "snarkjs";
import { Wallet } from "@coinbase/onchainkit/wallet";

function App() {
  const [loading, setLoading] = useState(false);

  const sendLocation = async () => {
    setLoading(true);
    const { proof, publicSignals } = await groth16.fullProve(
      {
        latitude: "376001", // scaled (19.0000)
        longitude: "972501", // scaled (72.0000)
      },
      "/circuits/location.wasm",
      "/circuits/location_0001.zkey"
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
    </>
  );
}

export default App;
