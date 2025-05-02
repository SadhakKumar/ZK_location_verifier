'use client';
 
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains'; // add baseSepolia for testing 
 
export function Providers(props) {
  return (
    <OnchainKitProvider
      apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY} 
      chain={base} // add baseSepolia for testing 
    >
      {props.children}
    </OnchainKitProvider>
  );
}