"use client";

import dynamic from "next/dynamic";

const BingoLobby = dynamic(() => import("~/components/BingoLobby"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title:"Bingo Lobby" }
) {
  return <BingoLobby title={title} />;
}
