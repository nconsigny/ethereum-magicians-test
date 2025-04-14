'use client'; // Required for useState

import React, { useState } from 'react'; // Import useState
import { Metadata } from "next";
// import App from "./app"; // Remove the old iframe wrapper if it exists
import LatestTopics from "@/components/LatestTopics"; // Adjust path if needed
import TopicDetail from "@/components/TopicDetail"; // Import TopicDetail
import CategoriesList from "@/components/CategoriesList"; // Import CategoriesList

const appUrl = process.env.NEXT_PUBLIC_URL || "https://ethereum-magicians-test.vercel.app";

// frame preview metadata
const appName = process.env.NEXT_PUBLIC_FRAME_NAME || "Ethereum Magicians";
const buttonText = process.env.NEXT_PUBLIC_FRAME_BUTTON_TEXT || "View Forum";
const appDescription = process.env.NEXT_PUBLIC_FRAME_DESCRIPTION || "View the Ethereum Magicians forum.";

const splashImageUrl = `${appUrl}/splash.png`;
// const iconUrl = `${appUrl}/icon.png`;

const framePreviewMetadata = {
  version: "next",
  imageUrl: `${appUrl}/opengraph-image`,
  button: {
    title: buttonText,
    action: {
      type: "launch_frame",
      name: appName,
      url: appUrl,
      splashImageUrl,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: appName,
    description: appDescription,
    openGraph: {
      title: appName,
      description: appDescription,
    },
    other: {
      "fc:frame": JSON.stringify(framePreviewMetadata),
    },
  };
}

export default function Home() {
  const [currentView, setCurrentView] = useState<'latest' | 'topic' | 'categories'>('latest');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);

  const handleTopicSelect = (topicId: number) => {
    setSelectedTopicId(topicId);
    setCurrentView('topic');
  };

  const handleBackToList = () => {
    setSelectedTopicId(null);
    // Decide where to go back: if we add category browsing, might need more state
    setCurrentView('latest'); // Defaulting to latest for now
  };

  const selectView = (view: 'latest' | 'categories') => {
    setSelectedTopicId(null); // Clear topic when switching main views
    setCurrentView(view);
  };

  return (
    // Use dark mode based on system preference by default via globals.css
    <main className="bg-background text-foreground min-h-screen font-sans">
      {/* Sticky Header/Nav */}
      {currentView !== 'topic' && ( // Hide tabs when viewing a topic detail
           <div className="flex border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
               <button
                   onClick={() => selectView('latest')}
                   className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors duration-150 ${ 
                    currentView === 'latest' 
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
                   }`}
               >
                   Latest
               </button>
               <button
                   onClick={() => selectView('categories')}
                   className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors duration-150 ${ 
                    currentView === 'categories' 
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
                   }`}
               >
                   Categories
               </button>
           </div>
      )}

      {/* Add a container, but maybe remove max-width for full mini-app width */}
      <div className="container mx-auto"> 
         {currentView === 'latest' && (
           <LatestTopics onTopicSelect={handleTopicSelect} />
         )}
         {currentView === 'categories' && (
            <CategoriesList /> // Assuming CategoriesList manages its own padding
         )}
         {currentView === 'topic' && selectedTopicId && (
           <TopicDetail topicId={selectedTopicId} onBack={handleBackToList} /> // Assuming TopicDetail manages its own padding
         )}
      </div>
    </main>
  );
}
