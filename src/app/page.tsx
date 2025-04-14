// Remove 'use client' directive
// import React, { useState } from 'react'; // No longer needed here
import { Metadata } from "next";
// Remove component imports, they are now in PageClient
// import LatestTopics from "@/components/LatestTopics"; 
// import TopicDetail from "@/components/TopicDetail";
// import CategoriesList from "@/components/CategoriesList";
// import CategoryTopicList from '@/components/CategoryTopicList'; 
import PageClient from "./page-client"; // Import the new client component

// Keep metadata generation logic as it's server-side
const appUrl = process.env.NEXT_PUBLIC_URL || "https://ethereum-magicians-test.vercel.app";
const appName = process.env.NEXT_PUBLIC_FRAME_NAME || "Ethereum Magicians";
const buttonText = process.env.NEXT_PUBLIC_FRAME_BUTTON_TEXT || "View Forum";
const appDescription = process.env.NEXT_PUBLIC_FRAME_DESCRIPTION || "View the Ethereum Magicians forum.";
const splashImageUrl = `${appUrl}/splash.png`;
const desiredImageUrl = `${appUrl}/eth.28aff33d.png`;
const desiredImageRelativePath = "/eth.28aff33d.png";

const framePreviewMetadata = {
  version: "next",
  imageUrl: desiredImageRelativePath,
  button: {
    title: buttonText,
    action: {
      type: "launch_frame",
      name: appName,
      url: appUrl,
      splashImageUrl,
      splashBackgroundColor: "#002b36",
    },
  },
};

// Keep revalidate export
export const revalidate = 300;

// Keep generateMetadata export
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: appName,
    description: appDescription,
    openGraph: {
      title: appName,
      description: appDescription,
      images: [{ url: desiredImageUrl }],
    },
    other: {
      "fc:frame": JSON.stringify(framePreviewMetadata),
    },
  };
}

// Default export now simply renders the client component
export default function Home() {
    // Render the client component which handles all the UI and state
    return <PageClient />;
}
