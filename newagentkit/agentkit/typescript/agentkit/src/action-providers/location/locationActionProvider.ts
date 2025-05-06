/**
 * Location Action Provider
 *
 * This file contains the implementation of the LocationActionProvider,
 * which provides actions for location operations.
 *
 * @module location
 */


import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { Network } from "../../network";
import { CreateAction } from "../actionDecorator";
import { CdpWalletProvider } from "../../wallet-providers";
import { GetLocationSchema } from "./schemas";
import { ethers } from "ethers";
import { abi } from "./location.json";




/**
 * LocationActionProvider provides actions for interacting with the Location smart contract
 * deployed on Base Sepolia network.
 */
export class LocationActionProvider extends ActionProvider<CdpWalletProvider> {
  private readonly contractAddress = '0xb790968827C07b7c66d9Db2BaC5098aDceEf1aCF';
  private readonly rpcUrl = 'https://sepolia.base.org';


  /**
   * Constructor for the LocationActionProvider.
   */
  constructor() {
    super("location", []);
  }


  /**
   * Fetches the location name from the smart contract
   * @param walletProvider - The wallet provider instance
   * @returns A promise that resolves to the location name
   */
  @CreateAction({
    name: 'get_location_name',
    description: 'Fetches the location name from the smart contract deployed on Base Sepolia',
    schema: z.object({}),
  })
  async getLocationName(walletProvider: CdpWalletProvider): Promise<boolean> {
    const signer = walletProvider.toSigner();
    const provider = new ethers.JsonRpcProvider(this.rpcUrl);
    const contract = new ethers.Contract(this.contractAddress, abi, provider);
   
    try {
      const locationName = await contract.getLocationName();
      return locationName;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch location name: ${error.message}`);
      }
      throw new Error('Failed to fetch location name: Unknown error occurred');
    }
  }
 


  /**
   * Checks if this provider supports the given network.
   *
   * @param network - The network to check support for
   * @returns True if the network is supported
   */
  supportsNetwork(network: Network): boolean {
    // all protocol networks
    return network.protocolFamily === "evm";
  }
}


/**
 * Factory function to create a new LocationActionProvider instance.
 *
 * @returns A new LocationActionProvider instance
 */
export const locationActionProvider = () => new LocationActionProvider();
