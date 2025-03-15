"use client";

import { useEffect, useState } from "react";
import sdk, {
  type Context,
} from "@farcaster/frame-sdk";
import Link from 'next/link';

import { createStore } from "mipd";

export default function BingoLobby(
  { title }: { title?: string } = { title: "Bingo Lobby" }
) {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [count, setCount] = useState(0);
  const [context, setContext] = useState<Context.FrameContext>();

  useEffect(() => {
    const load = async () => {
      const context = await sdk.context;
      setContext(context);

      sdk.on("primaryButtonClicked", () => {
        console.log("primaryButtonClicked");
      });

      console.log("Calling ready");
      sdk.actions.ready({});

      // Set up a MIPD Store, and request Providers.
      const store = createStore();

      // Subscribe to the MIPD Store.
      store.subscribe((providerDetails) => {
        console.log("PROVIDER DETAILS", providerDetails);
        // => [EIP6963ProviderDetail, EIP6963ProviderDetail, ...]
      });
    };
    if (sdk && !isSDKLoaded) {
      console.log("Calling load");
      setIsSDKLoaded(true);
      load();
      return () => {
        sdk.removeAllListeners();
      };
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="w-[300px] mx-auto py-2 px-2">
        <h1 className="text-2xl font-bold text-center mt-10 mb-4">Bingo Lobby{title}</h1>
        <Link 
          href="/bingo" 
          className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors text-center"
        >
          Start New Game
        </Link>
      </div>
    </div>
  );
}
