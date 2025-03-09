"use client";

import {
  useConnect,
  useAccount,
  useDisconnect,
  useBalance,
  useChainId,
  useSwitchChain,
} from "wagmi";
import { injected } from "wagmi/connectors";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  Wallet,
  ExternalLink,
  Copy,
  Power,
  User,
  AlertTriangle,
} from "lucide-react";

// Define Sonic Blaze Testnet constants
const SONIC_BLAZE_CHAIN_ID = 57054;

const CHAIN_NAMES: { [key: number]: string } = {
  57054: "Sonic Blaze Testnet",
  1: "Ethereum Mainnet",
  11155111: "Sepolia Testnet",
};

// Function to add Sonic Blaze Testnet to MetaMask
const addSonicBlazeTestnet = async () => {
  if (!window.ethereum) {
    console.error("MetaMask not detected");
    return false;
  }

  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${SONIC_BLAZE_CHAIN_ID.toString(16)}`, // Convert to hex
          chainName: "Sonic Blaze Testnet",
          nativeCurrency: {
            name: "Sonic",
            symbol: "S",
            decimals: 18,
          },
          rpcUrls: ["https://rpc.blaze.soniclabs.com"],
          blockExplorerUrls: ["https://blaze.soniclabs.com"],
        },
      ],
    });
    console.log("Sonic Blaze Testnet added to MetaMask!");
    return true;
  } catch (error) {
    console.error("Failed to add Sonic Blaze Testnet:", error);
    return false;
  }
};

// Function to switch to Sonic Blaze Testnet
const switchToSonicBlazeTestnet = async () => {
  if (!window.ethereum) {
    console.error("MetaMask not detected");
    return false;
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${SONIC_BLAZE_CHAIN_ID.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (error.code === 4902) {
      return addSonicBlazeTestnet();
    }
    console.error("Failed to switch to Sonic Blaze Testnet:", error);
    return false;
  }
};

export default function ConnectWallet() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { data: balance } = useBalance({
    address: address as `0x${string}`,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsCorrectNetwork(chainId === SONIC_BLAZE_CHAIN_ID);
  }, [chainId]);

  const handleConnect = async () => {
    try {
      // First, try to add the network
      await addSonicBlazeTestnet();

      // Then connect
      connect({
        connector: injected(),
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      if (switchChain) {
        await switchChain({ chainId: SONIC_BLAZE_CHAIN_ID });
      } else {
        await switchToSonicBlazeTestnet();
      }
      setIsCorrectNetwork(true);
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // You could add a toast notification here
    }
  };

  const openExplorer = () => {
    if (address) {
      window.open(`https://blaze.soniclabs.com/address/${address}`, "_blank");
    }
  };

  if (!mounted) {
    return null;
  }

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
      >
        <Wallet className="w-5 h-5" />
        <span className="font-semibold">Connect Wallet</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-white"
      >
        <User className="w-5 h-5" />
        <span className="font-medium hidden sm:inline">
          {formatAddress(address)}
        </span>
        {!isCorrectNetwork && (
          <AlertTriangle className="w-4 h-4 text-yellow-400" />
        )}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-2 z-50">
          <div className="p-3 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">
                Connected with MetaMask
              </span>
              <button
                onClick={() => disconnect()}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm font-medium"
              >
                <Power className="w-4 h-4" />
                Disconnect
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {address ? formatAddress(address) : ""}
                  </p>
                  <p className="text-sm text-gray-400">
                    {balance?.formatted
                      ? `${parseFloat(balance.formatted).toFixed(4)} ${
                          balance.symbol
                        }`
                      : "Loading..."}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={copyAddress}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-300 hover:text-white bg-gray-700 rounded-lg flex-1"
              >
                <Copy className="w-4 h-4" />
                Copy Address
              </button>
              <button
                onClick={openExplorer}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-300 hover:text-white bg-gray-700 rounded-lg flex-1"
              >
                <ExternalLink className="w-4 h-4" />
                View Explorer
              </button>
            </div>

            <div className="pt-2 border-t border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Network</span>
                <div className="flex items-center">
                  {isCorrectNetwork ? (
                    <span className="text-green-400 font-medium flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      {CHAIN_NAMES[chainId] || `Chain ${chainId}`}
                    </span>
                  ) : (
                    <button
                      onClick={handleSwitchNetwork}
                      className="text-yellow-400 font-medium flex items-center hover:text-yellow-300"
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Switch to Sonic Testnet
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
