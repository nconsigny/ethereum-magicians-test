'use client';

import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk'; // Assuming SDK is set up

// Define an interface for the topic structure based on Discourse API
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
  // Add other relevant fields as needed, e.g., category_id, tags, posters
}

interface DiscourseLatestResponse {
  topic_list?: {
    topics: Topic[];
  };
  // Include other potential top-level fields if necessary
}

interface LatestTopicsProps {
  onTopicSelect: (topicId: number) => void;
}

export default function LatestTopics({ onTopicSelect }: LatestTopicsProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component

    async function fetchLatestTopics() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/discourse/latest.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DiscourseLatestResponse = await response.json();

        if (isMounted) {
          if (data.topic_list?.topics) {
            setTopics(data.topic_list.topics);
            // Call ready() only after data is successfully fetched and state is set
            sdk.actions.ready().catch(console.error); // Call ready when content is ready
          } else {
            throw new Error('Invalid data structure received from API');
          }
        }
      } catch (err) {
        console.error('Failed to fetch latest topics:', err);
        if (isMounted) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            // Optionally call ready even on error to dismiss splash screen
            // sdk.actions.ready().catch(console.error);
        }
      } finally {
        if (isMounted) {
            setIsLoading(false);
        }
      }
    }

    fetchLatestTopics();

    return () => {
        isMounted = false; // Cleanup function to set isMounted to false
    };
  }, []);

  if (isLoading) {
    // TODO: Add a better loading skeleton/spinner
    return <div className="p-6 text-center text-gray-500">Loading topics...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error fetching topics: {error}</div>;
  }

  return (
    // Remove component-level padding if page.tsx handles it
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {/* No need for h2 if tabs provide context */}
      {/* <h2 className="text-2xl font-bold mb-4 p-4">Latest Topics</h2> */}
      {topics.length === 0 ? (
        <p className="p-6 text-center text-gray-500">No topics found.</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {topics.map((topic) => (
            <li
              key={topic.id}
              onClick={() => onTopicSelect(topic.id)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors block"
            >
              <span className="font-medium text-base block mb-1 text-foreground hover:text-blue-600 dark:hover:text-blue-400">{topic.title}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 block">
                Replies: {topic.reply_count} • Last Post: {new Date(topic.last_posted_at).toLocaleDateString()}
                {/* Consider adding category info here if available */} 
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 