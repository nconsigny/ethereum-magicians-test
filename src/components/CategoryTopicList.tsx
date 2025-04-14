'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import { BackButton } from './BackButton';

// Re-export or define Topic interface if not shared
interface Topic {
  id: number;
  title: string;
  slug: string;
  posts_count: number;
  reply_count: number;
  highest_post_number: number;
  created_at: string;
  last_posted_at: string;
  bumped: boolean;
  bumped_at: string;
  category_id: number;
}

// Expected response structure for category detail endpoint
interface DiscourseCategoryDetailResponse {
  topic_list?: {
    topics: Topic[];
  };
  // Include other fields like category details if needed (e.g., `category: { name: string }`)
}

// Component props
interface CategoryTopicListProps {
  categoryId: number;
  categorySlug: string;
  onTopicSelect: (topicId: number) => void;
  onBack: () => void;
}

/**
 * Component to fetch and display the list of topics within a specific category.
 */
export default function CategoryTopicList({
  categoryId,
  categorySlug,
  onTopicSelect,
  onBack,
}: CategoryTopicListProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Derive the category name directly, no need for state setter if not updating later
  const categoryName = categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Category';

  // Fetch topics for the selected category
  const fetchCategoryTopics = useCallback(async () => {
    if (!categoryId || !categorySlug) return;
    setIsLoading(true);
    setError(null);
    // Endpoint pattern for Discourse category topics
    const endpoint = `/api/discourse/c/${categorySlug}/${categoryId}.json`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data: DiscourseCategoryDetailResponse = await response.json();

      if (data.topic_list) { // Check if topic_list exists, even if empty
        setTopics(data.topic_list.topics || []); // Handle null/undefined topics array
        // TODO: Potentially extract category name from `data.category.name` if API provides it
        sdk.actions.ready().catch(console.error);
      } else {
        throw new Error('Invalid data structure received for category topics');
      }
    } catch (err) {
      console.error(`Failed to fetch topics for category ${categoryId}:`, err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred fetching category topics');
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, categorySlug]);

  // Fetch data when categoryId or categorySlug changes
  useEffect(() => {
    fetchCategoryTopics();
  }, [fetchCategoryTopics]);

  // Render loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render error state with retry
  if (error) {
    return (
      <div className="p-4">
        <BackButton onClick={onBack} text="Back to Categories" className="mb-4" />
        <ErrorMessage message={error} onRetry={fetchCategoryTopics} />
      </div>
    );
  }

  // Render topic list for the category
  return (
    <div className="p-4">
      <BackButton onClick={onBack} text="Back to Categories" className="mb-4" />
      <h2 className="text-xl font-semibold mb-5 text-foreground">Topics in: {categoryName}</h2>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {topics.length === 0 ? (
            <p className="p-6 text-center text-gray-500">No topics found in this category.</p>
          ) : (
            <ul className="list-none p-0 m-0">
              {topics.map((topic) => (
                <li
                  key={topic.id}
                  onClick={() => onTopicSelect(topic.id)}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors block"
                  aria-label={`View topic: ${topic.title}`}
                >
                  <span className="font-medium text-base block mb-1 text-foreground hover:text-blue-600 dark:hover:text-blue-400">{topic.title}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">
                    Replies: {topic.reply_count} • Last Post: {new Date(topic.last_posted_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
    </div>
  );
} 