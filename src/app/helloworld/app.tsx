"use client";

import dynamic from "next/dynamic";

const HelloWorld = dynamic(() => import("~/components/HelloWorld"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: "Hello World" }
) {
  return <HelloWorld title={title} />;
}
