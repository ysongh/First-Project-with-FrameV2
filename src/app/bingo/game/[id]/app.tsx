"use client";

import dynamic from "next/dynamic";

const Bingo = dynamic(() => import("~/components/Bingo"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Bingo" }
) {
  return <Bingo title={title} />;
}
