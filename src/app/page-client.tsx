'use client'; // This component handles state and interactivity

import React, { useState } from 'react';
import Image from 'next/image'; // Import next/image
import LatestTopics from "../components/LatestTopics";
import TopicDetail from "../components/TopicDetail";
import CategoriesList from "../components/CategoriesList";
import CategoryTopicList from '../components/CategoryTopicList';
import { sdk } from '@farcaster/frame-sdk'; // Ensure sdk is imported if needed

// Type for the different views
type View = 'latest' | 'topic' | 'categories' | 'categoryDetail';

/**
 * Client component responsible for rendering the main UI and handling view state.
 */
export default function PageClient() {
  const [currentView, setCurrentView] = useState<View>('latest');
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Tell Farcaster client the app is ready
  React.useEffect(() => {
      sdk.actions.ready().catch(console.error);
  }, []);

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
    // Use sol-base02 for the main background for slightly less dark contrast?
     <main className="bg-sol-base02 text-sol-violet min-h-screen font-sans">

        {/* Header Area - Only show on main views */}
        {currentView !== 'topic' && currentView !== 'categoryDetail' && (
          <div className="py-2 px-4 flex flex-col items-center space-y-2 sticky top-0 bg-sol-base02/90 backdrop-blur-sm z-10 border-b border-sol-base01/50">
             {/* Use the new illustration */}
             <Image 
               src="/what-is-ethereum.b37ce60e.png" // Updated src path
               alt="What is Ethereum illustration"   // Updated alt text
               width={180} // Keep size or adjust further?
               height={50} // Adjust height as needed
               priority 
             />
             {/* Navigation Tabs */}
             <div className="flex border-b-0 w-full">
                 <button
                     onClick={() => selectMainView('latest')}
                     className={`flex-1 py-2 px-4 text-center text-sm font-medium transition-colors duration-150 ${ 
                      currentView === 'latest' 
                      ? 'border-b-2 border-sol-violet text-sol-violet'
                      : 'text-sol-base0 hover:bg-sol-base03/50 hover:text-sol-violet border-b-2 border-transparent'
                     }`}
                 >
                     Latest
                 </button>
                 <button
                     onClick={() => selectMainView('categories')}
                     className={`flex-1 py-2 px-4 text-center text-sm font-medium transition-colors duration-150 ${ 
                      currentView === 'categories' 
                      ? 'border-b-2 border-sol-violet text-sol-violet'
                      : 'text-sol-base0 hover:bg-sol-base03/50 hover:text-sol-violet border-b-2 border-transparent'
                     }`}
                 >
                     Categories
                 </button>
             </div>
          </div>
        )}
 
        {/* Main Content Area */}
       <div className="mx-auto">
          {currentView === 'latest' && (
            <LatestTopics onTopicSelect={handleTopicSelect} />
          )}
          {currentView === 'categories' && (
             <CategoriesList onCategorySelect={handleCategorySelect} /> 
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
            <TopicDetail topicId={selectedTopicId} onBack={handleBackFromTopic} /> 
          )}
       </div>
     </main>
  );
} 