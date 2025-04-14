'use client'; // This component handles state and interactivity

import React, { useState } from 'react';
import LatestTopics from "../components/LatestTopics";
import TopicDetail from "../components/TopicDetail";
import CategoriesList from "../components/CategoriesList";
import CategoryTopicList from '../components/CategoryTopicList';

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
 
       {/* Main Content Area - Components handle their own padding */}
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