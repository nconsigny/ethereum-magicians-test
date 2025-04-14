'use client';

import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

// Interface for individual topic data from Discourse API
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

// Expected structure of the /latest.json response
interface DiscourseLatestResponse {
  topic_list?: {
    topics: Topic[];
  };
}

// Props for the component
interface LatestTopicsProps {
  onTopicSelect: (topicId: number) => void;
}

/**
 * Component to fetch and display the latest topics from the Discourse forum.
 */
export default function LatestTopics({ onTopicSelect }: LatestTopicsProps) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest topics from the backend API proxy
  async function fetchLatestTopics() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/discourse/latest.json');
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data: DiscourseLatestResponse = await response.json();

      if (data.topic_list?.topics) {
        setTopics(data.topic_list.topics);
        // Signal to Farcaster client that the UI is ready
        sdk.actions.ready().catch(console.error);
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (err) {
      console.error('Failed to fetch latest topics:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred fetching topics');
    } finally {
      setIsLoading(false);
    }
  }

  // Fetch data on initial component mount
  useEffect(() => {
    fetchLatestTopics();
  }, []);

  // Render loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render error state with retry button
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchLatestTopics} />;
  }

  // Render topic list
  return (
    <div className="divide-y divide-sol-base01/50">
      {topics.length === 0 ? (
        <p className="p-6 text-center text-sol-base0">No topics found.</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {topics.map((topic) => (
            <li
              key={topic.id}
              onClick={() => onTopicSelect(topic.id)}
              className="p-4 hover:bg-sol-base02 cursor-pointer transition-colors block"
              aria-label={`View topic: ${topic.title}`}
            >
              <span className="font-medium text-base block mb-1 hover:text-sol-violet">{topic.title}</span>
              <span className="text-xs text-sol-base00 block">
                Replies: {topic.reply_count} • Last Post: {new Date(topic.last_posted_at).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 