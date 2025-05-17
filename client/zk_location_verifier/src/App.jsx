import { useState } from "react";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useContract } from "./context/Providers";
import { ethers } from "ethers";
import { groth16 } from "snarkjs";
import {
  CheckCircle,
  Clock,
  Globe,
  Shield,
  Loader2,
  Lock,
  MapPin,
  User,
  // Passport,
} from "lucide-react";
import { BrowserProvider } from "ethers";

export default function App() {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [period, setPeriod] = useState("");
  const [enrolled, setEnrolled] = useState(false);
  const [result, setResult] = useState("");
  const contract = useContract();
  const [isAuthority, setIsAuthority] = useState(false);
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [activeTab, setActiveTab] = useState("enroll"); // "enroll" or "verify"

  const stakeForVisa = async () => {
    try {
      if (!period || isNaN(period)) {
        alert("Please enter a valid visa period");
        return;
      }
      setLoading1(true);
      const parsedPeriod = parseInt(period) * 60;
      const amount = ethers.parseEther("0.001");
      const tx = await contract.stake(parsedPeriod, amount, { value: amount });
      await tx.wait();
      console.log("Stake successful");
      console.log(tx.hash);
      setEnrolled(true);
      setResult(`✅ Enrollment successful! Visa period: ${period} days`);
      setActiveTab("verify");
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

      const { proof, publicSignals } = await groth16.fullProve(
        {
          latitude: "35",
          longitude: "69",
        },
        "/circuits/locationV2.wasm",
        "/circuits/locationV2_0001.zkey"
      );

      console.log("Proof: ", proof);
      console.log("Public Signals: ", publicSignals);

      const a = [proof.pi_a[0], proof.pi_a[1]];
      const b = [
        [proof.pi_b[0][1], proof.pi_b[0][0]],
        [proof.pi_b[1][1], proof.pi_b[1][0]],
      ];
      const c = [proof.pi_c[0], proof.pi_c[1]];

      setResult("Calling withdrawByImmigrant...");

      const tx = await contract.withdrawByImmigrant(a, b, c, publicSignals);
      await tx.wait();

      console.log("✅ Withdrawal successful:", tx.hash);
      setResult(
        `✅ Withdrawal success! Tx Hash: ${tx.hash.substring(0, 10)}...`
      );
    } catch (err) {
      console.error("❌ Verification or Withdrawal failed:", err);
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading2(false);
    }
  };

  const performAuthorityWithdrawal = async () => {
    try {
      if (!withdrawAddress || !ethers.isAddress(withdrawAddress)) {
        setResult("❌ Please enter a valid Ethereum address");
        return;
      }
      setLoading2(true);
      const tx = await contract.withdrawByAuthority(withdrawAddress);
      await tx.wait();
      setResult(
        `✅ Authority withdrew successfully! Tx: ${tx.hash.substring(0, 10)}...`
      );
    } catch (err) {
      console.error("Authority withdraw failed:", err);
      setResult(`❌ Authority withdrawal failed: ${err.message}`);
    } finally {
      setLoading2(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-4 md:p-6 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 blur-xl opacity-20 rounded-full"></div>
              <User className="h-20 w-20 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            SecureVisa
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Next-generation decentralized visa application with zero-knowledge
            proof verification
          </p>
        </div>

        {/* Wallet Connection & Authority Login */}
        <div className="mb-8 flex md:flex-row items-center justify-between gap-4 bg-indigo-900 rounded-xl p-4 shadow-xl border border-white border-opacity-20">
          <div className="flex-1">
            <Wallet className="!bg-gradient-to-r from-violet-600 to-indigo-600 !text-white !border-none !rounded-lg !shadow-lg z-10" />
          </div>
          <div className="flex-1 flex justify-end">
            {!isAuthority ? (
              <button
                onClick={async () => {
                  const actualAuthority =
                    "0xb5502F298c4C50165005829bE78CE5ec577738f5";
                  const provider = new BrowserProvider(window.ethereum);
                  const signer = await provider.getSigner();
                  if (signer.address === actualAuthority) {
                    setIsAuthority(true);
                  } else {
                    alert("Not authorized");
                  }
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all shadow-lg"
              >
                <Lock size={18} />
                Authority Login
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-400 bg-indigo-800 px-4 py-2 rounded-lg border border-green-400 border-opacity-20">
                <CheckCircle size={18} className="text-green-400" />
                <span className="font-medium">Authority Access Granted</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-indigo-900 rounded-2xl shadow-2xl border border-white border-opacity-20 overflow-hidden mb-10">
          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-0 border-b border-white border-opacity-10">
            {[
              {
                icon: <Shield className="h-10 w-10 text-blue-300" />,
                title: "Secure Staking",
                text: "Protected by blockchain technology",
                color: "from-blue-500 to-indigo-500",
              },
              {
                icon: <Clock className="h-10 w-10 text-purple-300" />,
                title: "Flexible Duration",
                text: "Choose your visa period",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: <Globe className="h-10 w-10 text-pink-300" />,
                title: "Location Verification",
                text: "Zero-knowledge location proof",
                color: "from-pink-500 to-rose-500",
              },
            ].map(({ icon, title, text, color }, i) => (
              <div
                key={i}
                className={`flex flex-col items-center p-8 relative hover:bg-indigo-800 transition-all duration-300 z-1${
                  i < 2 ? "border-r border-white border-opacity-10" : ""
                }`}
              >
                <div
                  className={`p-4 rounded-full bg-gradient-to-br ${color} bg-opacity-20 mb-4`}
                >
                  {icon}
                </div>
                <h3 className="font-bold text-white text-xl mb-2">{title}</h3>
                <p className="text-center text-white opacity-90">{text}</p>
              </div>
            ))}
          </div>

          {!isAuthority ? (
            <div className="p-8">
              {/* Tabs */}
              <div className="flex border-b border-white border-opacity-10 mb-8">
                <button
                  onClick={() => setActiveTab("enroll")}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === "enroll"
                      ? "text-white border-b-2 border-purple-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Enroll for Visa
                </button>
                <button
                  onClick={() => setActiveTab("verify")}
                  className={`px-6 py-3 font-medium transition-all ${
                    activeTab === "verify"
                      ? "text-white border-b-2 border-purple-400"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Verify Location
                </button>
              </div>

              {/* Enrollment Tab */}
              {activeTab === "enroll" && (
                <div className="space-y-8">
                  <div className="bg-indigo-800 rounded-xl p-6 border border-white border-opacity-10">
                    <div className="flex items-start mb-6">
                      <div className="mr-4 mt-1">
                        <User className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Enroll for Visa
                        </h3>
                        <p className="text-white opacity-90">
                          Secure your visa by staking 0.001 ETH. Your funds will
                          be returned upon successful verification.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label
                          htmlFor="period"
                          className="block text-sm font-medium text-white mb-2"
                        >
                          Visa Period (days)
                        </label>
                        <input
                          id="period"
                          type="number"
                          value={period}
                          placeholder="Enter visa duration"
                          onChange={(e) => setPeriod(e.target.value)}
                          className="w-full px-4 py-3 bg-indigo-700 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-300 placeholder-opacity-70"
                        />
                      </div>
                      <div className="col-span-1 flex items-end">
                        <button
                          onClick={stakeForVisa}
                          disabled={loading1}
                          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                          {loading1 ? (
                            <span className="flex items-center justify-center">
                              <Loader2 className="animate-spin h-5 w-5 mr-2" />
                              Processing...
                            </span>
                          ) : (
                            "Enroll Now"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 flex items-center shadow-lg">
                    <div className="mr-4 p-3 bg-indigo-800 rounded-full">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">
                        Secure & Transparent
                      </h4>
                      <p className="text-white">
                        All transactions are secured by blockchain with complete
                        transparency
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Verification Tab */}
              {activeTab === "verify" && (
                <div className="space-y-8">
                  <div className="bg-indigo-800 rounded-xl p-6 border border-white border-opacity-10">
                    <div className="flex items-start mb-6">
                      <div className="mr-4 mt-1">
                        <MapPin className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                          Location Verification
                        </h3>
                        <p className="text-white opacity-90">
                          Verify your location using zero-knowledge proof to
                          complete the visa process and withdraw your stake.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={verifyLocation}
                      disabled={loading2}
                      className="w-full md:w-1/2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
                    >
                      {loading2 ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="animate-spin h-5 w-5 mr-2" />
                          Verifying...
                        </span>
                      ) : (
                        <>
                          <Globe className="h-5 w-5 mr-2" />
                          Verify & Withdraw
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 flex items-center shadow-lg">
                    <div className="mr-4 p-3 bg-indigo-800 rounded-full">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium text-lg">
                        Privacy Protected
                      </h4>
                      <p className="text-white">
                        Zero-knowledge proofs verify your location without
                        revealing exact coordinates
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Result Message */}
              {result && (
                <div
                  className={`mt-8 p-5 rounded-xl transition-all duration-300 ${
                    result.includes("✅")
                      ? "bg-green-500 bg-opacity-30 border border-green-500 border-opacity-30 text-white"
                      : result.includes("❌")
                      ? "bg-red-500 bg-opacity-30 border border-red-500 border-opacity-30 text-white"
                      : "bg-blue-500 bg-opacity-30 border border-blue-500 border-opacity-30 text-white"
                  }`}
                >
                  <p className="flex items-center">
                    {result.includes("✅") ? (
                      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                    ) : result.includes("❌") ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-red-500 bg-opacity-20 text-red-300 flex-shrink-0">
                        ✕
                      </span>
                    ) : (
                      <Loader2 className="animate-spin h-5 w-5 mr-2 flex-shrink-0 text-blue-400" />
                    )}
                    <span>{result}</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8">
              <div className="bg-indigo-800 rounded-xl p-6 border border-white border-opacity-10">
                <div className="flex items-start mb-6">
                  <div className="mr-4 mt-1">
                    <User className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Authority Dashboard
                    </h3>
                    <p className="text-white opacity-90">
                      Manage visa expirations and withdraw stakes from expired
                      visas.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white mb-1">
                    Immigrant Wallet Address
                  </label>
                  <input
                    type="text"
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                    placeholder="0x..."
                    className="w-full px-4 py-3 bg-indigo-700 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-300 placeholder-opacity-70"
                  />
                  <button
                    onClick={performAuthorityWithdrawal}
                    disabled={loading2}
                    className="w-full md:w-1/3 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center mt-4"
                  >
                    {loading2 ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                        Processing...
                      </span>
                    ) : (
                      "Withdraw Stake"
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-white mb-1">
                  Immigrant Wallet Address
                </label>
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-white placeholder-gray-300 placeholder-opacity-70"
                />
                <button
                  onClick={performAuthorityWithdrawal}
                  disabled={loading2}
                  className="w-full md:w-1/3 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-lg transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center mt-4"
                >
                  {loading2 ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      Processing...
                    </span>
                  ) : (
                    "Withdraw Stake"
                  )}
                </button>
              </div>
            </div>
          )}
          {/* Result Message for Authority */}

          {result && (
            <div
              className={`mt-8 p-5 rounded-xl transition-all duration-300 ${
                result.includes("✅")
                  ? "bg-green-500 bg-opacity-10 border border-green-500 border-opacity-30 text-white"
                  : result.includes("❌")
                  ? "bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 text-white"
                  : "bg-blue-500 bg-opacity-10 border border-blue-500 border-opacity-30 text-white"
              }`}
            >
              <p className="flex items-center">
                {result.includes("✅") ? (
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                ) : result.includes("❌") ? (
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-red-500 bg-opacity-20 text-red-300 flex-shrink-0">
                    ✕
                  </span>
                ) : (
                  <Loader2 className="animate-spin h-5 w-5 mr-2 flex-shrink-0 text-blue-400" />
                )}
                <span>{result}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          {
            label: "Users Protected",
            value: "12.5K+",
            color: "from-blue-500 to-indigo-500",
          },
          {
            label: "Visas Issued",
            value: "8.2K+",
            color: "from-indigo-500 to-purple-500",
          },
          {
            label: "Success Rate",
            value: "99.8%",
            color: "from-purple-500 to-pink-500",
          },
          {
            label: "ETH Secured",
            value: "52.3+",
            color: "from-pink-500 to-rose-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 border border-white border-opacity-10 shadow-lg"
          >
            <h4
              className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}
            >
              {stat.value}
            </h4>
            <p className="text-black opacity-90">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center text-white text-sm py-8 border-t border-white border-opacity-5">
        <p className="mb-2">SecureVisa • Powered by Blockchain</p>
        <p className="opacity-70">
          © {new Date().getFullYear()} • Secure Decentralized Visa Solution
        </p>
      </div>
    </div>
    // </div>
  );
}
