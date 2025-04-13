"use client";

// import dynamic from "next/dynamic";


// // note: dynamic import is required for components that use the Frame SDK
// const Demo = dynamic(() => import("~/components/Demo"), {
//   ssr: false,
// });

export default function App() {
  return (
    <iframe
      src="https://ethereum-magicians.org/"
      style={{ width: "100%", height: "100vh", border: "none" }}
      title="Ethereum Magicians Forum"
    />
  );
}
