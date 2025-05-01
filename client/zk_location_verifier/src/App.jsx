import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { groth16 } from "snarkjs";


function App() {
  const [loading, setLoading] = useState(false)

  const sendLocation = async () => {
    setLoading(true)
    const { proof, publicSignals } = await groth16.fullProve(
      {
        latitude: "376001",        // scaled (19.0000)
        longitude: "972501",        // scaled (72.0000)
      },
      "/circuits/location.wasm",
      "/circuits/location_0001.zkey"
    );
    console.log("proof: ", proof);
    console.log("publicSignals: ", publicSignals);
    setLoading(false)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={sendLocation}>
          click
        </button>

        {loading && <h1>Loading...</h1>}
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
