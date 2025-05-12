import { useState } from "react";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useContract } from "./context/Providers";
import { ethers } from "ethers";
import { groth16 } from "snarkjs";
// Import Lucide icons using the full package path
import { CheckCircle } from "lucide-react";
import { Clock } from "lucide-react";
import { Globe } from "lucide-react";
import { Shield } from "lucide-react";
import { Loader2 } from "lucide-react";
import './App.css'
import { motion } from "framer-motion";
import { BrowserProvider, Contract } from "ethers";

export default function App() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [period, setPeriod] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [result, setResult] = useState("");
  const contract = useContract();
  // import { useState } from "react";

const [isAuthority, setIsAuthority] = useState(false);
const [adminAddress, setAdminAddress] = useState(""); // for input
const [withdrawAddress, setWithdrawAddress] = useState(""); // address to withdraw for


  const stakeForVisa = async () => {
    try {
      if (!period || isNaN(period)) {
        alert("Please enter a valid visa period");
        return;
      }
      setLoading1(true);
      const parsedPeriod = parseInt(period) * 60;
      const amount = ethers.parseEther("0.0000001");
      const tx = await contract.stake(parsedPeriod, amount, { value: amount });
      await tx.wait();
      console.log("Stake successful");
      console.log(tx.hash);
      setEnrolled(true);
      setResult(`✅ Enrollment successful! Visa period: ${period} days`);
    } catch (err) {
      console.error("Stake failed:", err);
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading1(false);
    }
  };

  const verifyLocation = async () => {
    try {
      setLoading2(true);
      setResult("Generating proof...");

      const { proof } = await groth16.fullProve(
        {
          latitude: "35",
          longitude: "69",
        },
        "/circuits/locationV2.wasm",
        "/circuits/locationV2_0001.zkey"
      );

      console.log("Proof: ", proof);

      const a = [proof.pi_a[0], proof.pi_a[1]];
      const b = [
        [proof.pi_b[0][1], proof.pi_b[0][0]],
        [proof.pi_b[1][1], proof.pi_b[1][0]],
      ];
      const c = [proof.pi_c[0], proof.pi_c[1]];

      setResult("Calling withdrawByImmigrant...");
      
      const tx = await contract.withdrawByImmigrant(a, b, c);
      await tx.wait();

      console.log("✅ Withdrawal successful:", tx.hash);
      setResult(`✅ Withdrawal success! Tx Hash: ${tx.hash.substring(0, 10)}...`);
    } catch (err) {
      console.error("❌ Verification or Withdrawal failed:", err);
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading2(false);
    }
  };
  return (

    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 min-h-screen">
  <div className="max-w-7xl mx-auto">{/* Header */} <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10" > <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-900 mb-3"> Secure Visa Enrollment & Staking </h1> <p className="text-lg text-gray-700 "> Decentralized visa application with proof-of-location verification using zero-knowledge proofs. </p> </motion.div>
      {/* Wallet Connection */}
      <div className="mb-4">
  {!isAuthority ? (
    <div className="flex gap-2 items-center">
      <button
        onClick={async () => {
          // Add your actual authority address here for check
          const actualAuthority = "0x574bddf82B02509EDdc514d5602325B724CE51Ca";
          const provider = new BrowserProvider(window.ethereum); // ✅ Ethers v6
          const signer = await provider.getSigner();
          console.log(signer.address.toLowerCase())
          if ( signer.address === actualAuthority) {
            setIsAuthority(true);
          } else {
            alert("Not authorized");
          }
        }}
        className="bg-black text-white px-6 py-3 rounded hover:bg-gray-600"
      >
        Login as Authority
      </button>
    </div>
  ) : (
    <p className="text-green-700 font-semibold">✅ Logged in as Authority</p>
  )}
</div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-10 flex justify-center"
      >
        <Wallet />
      </motion.div>
    
      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white border-2 border-transparent bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-80 rounded-2xl shadow-2xl p-8 md:p-12 mb-10 relative"
        style={{
          borderImage: "linear-gradient(to right, #7F00FF, #E100FF) 1",
        }}
      >
        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[ 
            {
              icon: <Shield className="h-12 w-12 text-blue-600 mb-3" />,
              title: "Secure Staking",
              text: "Protected by blockchain technology",
            },
            {
              icon: <Clock className="h-12 w-12 text-indigo-600 mb-3" />,
              title: "Flexible Duration",
              text: "Choose your visa period",
            },
            {
              icon: <Globe className="h-12 w-12 text-purple-600 mb-3" />,
              title: "Location Verification",
              text: "Zero-knowledge location proof",
            },
          ].map(({ icon, title, text }, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center p-4 border border-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 rounded-xl bg-white shadow-sm transition"
            >
              {icon}
              <h3 className="font-semibold text-indigo-800 text-lg">{title}</h3>
              <p className="text-center text-sm text-gray-600">{text}</p>
            </motion.div>
          ))}
        </div>
        {!isAuthority ? (
  <>
    {/* Visa Enrollment Section */}
    {/* Location Verification Section */}
           {/* Enrollment Section */}
           <div className="border-t border-gray-200 pt-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enroll for Visa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-2">
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                Visa Period (days)
              </label>
              <input
                id="period"
                type="number"
                value={period}
                placeholder="Enter visa duration"
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="col-span-1 flex items-end">
              <div
                className="w-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:bg-indigo-400"
>
            <button
  onClick={stakeForVisa}
  disabled={loading1}
>
                {loading1 ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </span>
                ) : (
                  "Enroll for Visa"
                )}
              </button>
                </div>
            </div>
          </div>
        </div>
    
        {/* Verification Section */}
        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location Verification</h2>
          <p className="text-gray-600 mb-4">
            Verify your location using zero-knowledge proof to complete the visa process.
          </p>
          <div
            onClick={verifyLocation}
            className="w-full md:w-1/3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:bg-green-400"
          >
          <button
            disabled={loading2}
            >
            {loading2 ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Verifying...
              </span>
            ) : (
              "Verify & Withdraw"
            )}
          </button>
            </div>
        </div>
    
        {/* Result Message */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`mt-8 p-4 rounded-lg transition-all duration-300 ${
              result.includes("✅")
                ? "bg-green-50 border border-green-200 text-green-700"
                : result.includes("❌")
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-blue-50 border border-blue-200 text-blue-700"
            }`}
          >
            <p className="flex items-center">
              {result.includes("✅") ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : result.includes("❌") ? (
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-red-100 text-red-500">
                  ✕
                </span>
              ) : (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              )}
              {result}
            </p>
          </motion.div>
        )}

  </>
) : (
  <>
  <div className="border-t border-gray-200 pt-6">
  <h2 className="text-2xl font-semibold text-gray-800 mb-4">Withdraw by Authority</h2>
  <p className="text-gray-600 mb-4">
    Enter the wallet address of a visa-expired immigrant to withdraw their stake.
  </p>
  <input
    type="text"
    value={withdrawAddress}
    onChange={(e) => setWithdrawAddress(e.target.value)}
    placeholder="Immigrant wallet address"
    className="w-full md:w-1/2 px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
  />
  <div
    onClick={async () => {
      try {
        const tx = await contract.withdrawByAuthority(withdrawAddress);
        await tx.wait();
        setResult(`✅ Authority withdrew successfully! Tx: ${tx.hash.substring(0, 10)}...`);
      } catch (err) {
        console.error("Authority withdraw failed:", err);
        setResult("❌ Authority withdrawal failed.");
      }
    }}
  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg"
  >

  <button
    >
    Withdraw Stake
  </button>
    </div>
</div>

  </>
)}

    
        {/* Enrollment Section
        <div className="border-t border-gray-200 pt-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Enroll for Visa</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="col-span-2">
              <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                Visa Period (days)
              </label>
              <input
                id="period"
                type="number"
                value={period}
                placeholder="Enter visa duration"
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="col-span-1 flex items-end">
              <div
                className="w-full px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors disabled:bg-indigo-400"
>
            <button
  onClick={stakeForVisa}
  disabled={loading1}
>
                {loading1 ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Processing...
                  </span>
                ) : (
                  "Enroll for Visa"
                )}
              </button>
                </div>
            </div>
          </div>
        </div> */}
    
        {/* Verification Section */}
        {/* <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Location Verification</h2>
          <p className="text-gray-600 mb-4">
            Verify your location using zero-knowledge proof to complete the visa process.
          </p>
          <div
            onClick={verifyLocation}
            className="w-full md:w-1/3 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:bg-green-400"
          >
          <button
            disabled={loading2}
            >
            {loading2 ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Verifying...
              </span>
            ) : (
              "Verify & Withdraw"
            )}
          </button>
            </div>
        </div> */}
    
        {/* Result Message */}
        {/* {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`mt-8 p-4 rounded-lg transition-all duration-300 ${
              result.includes("✅")
                ? "bg-green-50 border border-green-200 text-green-700"
                : result.includes("❌")
                ? "bg-red-50 border border-red-200 text-red-700"
                : "bg-blue-50 border border-blue-200 text-blue-700"
            }`}
          >
            <p className="flex items-center">
              {result.includes("✅") ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : result.includes("❌") ? (
                <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-red-100 text-red-500">
                  ✕
                </span>
              ) : (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              )}
              {result}
            </p>
          </motion.div>
        )} */}
      </motion.div>
    
      {/* Footer */}
      <div className="text-center text-gray-500 text-sm mt-10">
        Secure Visa Processing • Powered by Blockchain • © {new Date().getFullYear()}
      </div>
    </div>
    </div> );
}