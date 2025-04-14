'use client'; // Required for useState

import React, { useState } from 'react'; // Import useState
import { Metadata } from "next";
// import App from "./app"; // Remove the old iframe wrapper if it exists
import LatestTopics from "@/components/LatestTopics"; // Adjust path if needed
import TopicDetail from "@/components/TopicDetail"; // Import TopicDetail
import CategoriesList from "@/components/CategoriesList"; // Import CategoriesList
import CategoryTopicList from '@/components/CategoryTopicList'; // Import the new component

// Type for the different views
type View = 'latest' | 'topic' | 'categories' | 'categoryDetail';

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
  const [currentView, setCurrentView] = useState<View>('latest');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Navigate to Topic Detail View
  const handleTopicSelect = (topicId: number) => {
    setSelectedTopicId(topicId);
    setCurrentView('topic');
  };

  // Navigate to Category Detail View
  const handleCategorySelect = (categoryId: number, categorySlug: string) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategorySlug(categorySlug);
    setCurrentView('categoryDetail');
  };

  // Go back from Topic Detail
  const handleBackFromTopic = () => {
    const previousView = selectedCategoryId ? 'categoryDetail' : 'latest'; // Go back to category or latest
    setSelectedTopicId(null);
    setCurrentView(previousView);
  };

   // Go back from Category Detail to Categories List
   const handleBackToCategories = () => {
    setSelectedCategoryId(null);
    setSelectedCategorySlug(null);
    setCurrentView('categories');
  };

  // Switch between main views (Latest / Categories)
  const selectMainView = (view: 'latest' | 'categories') => {
    setSelectedTopicId(null);
    setSelectedCategoryId(null);
    setSelectedCategorySlug(null);
    setCurrentView(view);
  };

  return (
    // Use dark mode based on system preference by default via globals.css
    <main className="bg-background text-foreground min-h-screen font-sans">
      {/* Sticky Header/Nav - Hide if viewing a topic or category detail */}
      {currentView !== 'topic' && currentView !== 'categoryDetail' && (
           <div className="flex border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
               <button
                   onClick={() => selectMainView('latest')}
                   className={`flex-1 py-3 px-4 text-center text-sm font-medium transition-colors duration-150 ${ 
                    currentView === 'latest' 
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-200'
                   }`}
               >
                   Latest
               </button>
               <button
                   onClick={() => selectMainView('categories')}
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

      {/* Main Content Area - Remove container padding, let components handle it */}
      <div className="mx-auto"> 
         {currentView === 'latest' && (
           <LatestTopics onTopicSelect={handleTopicSelect} />
         )}
         {currentView === 'categories' && (
            <CategoriesList onCategorySelect={handleCategorySelect} /> // Pass the handler
         )}
          {currentView === 'categoryDetail' && selectedCategoryId && selectedCategorySlug && (
             <CategoryTopicList 
                categoryId={selectedCategoryId} 
                categorySlug={selectedCategorySlug} 
                onTopicSelect={handleTopicSelect}
                onBack={handleBackToCategories}
             />
          )}
         {currentView === 'topic' && selectedTopicId && (
           <TopicDetail topicId={selectedTopicId} onBack={handleBackFromTopic} /> // Use updated back handler
         )}
      </div>
    </main>
  );
}
