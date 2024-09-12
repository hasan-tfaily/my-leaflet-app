"use client"; // Ensures this code runs only on the client side

import dynamic from "next/dynamic";

// Dynamically import the Map component with { ssr: false } to disable server-side rendering
const Map = dynamic(() => import("../component/map"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen h-[2000px]">
      <Map />
    </main>
  );
}
