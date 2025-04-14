'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

// Interface for individual post data
interface Post {
  id: number;
  username: string;
  cooked: string; // Rendered HTML content
  created_at: string;
}

// Expected response structure for topic detail endpoint
interface TopicDetailResponse {
  id: number;
  title: string;
  post_stream?: {
    posts: Post[];
  };
}

// Component props
interface TopicDetailProps {
  topicId: number;
  onBack: () => void; // Callback to navigate back
}

/**
 * Component to fetch and display the details and posts of a specific topic.
 */
export default function TopicDetail({ topicId, onBack }: TopicDetailProps) {
  const [topic, setTopic] = useState<TopicDetailResponse | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch topic details from the backend API proxy
  const fetchTopicDetail = useCallback(async () => {
    if (!topicId) return; // Avoid fetching if topicId is somehow null
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/discourse/t/${topicId}.json`);
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data: TopicDetailResponse = await response.json();

      setTopic(data);
      setPosts(data.post_stream?.posts || []);
      // Signal to Farcaster client that the UI is ready
      sdk.actions.ready().catch(console.error);

    } catch (err) {
      console.error(`Failed to fetch topic ${topicId}:`, err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred fetching topic detail');
    } finally {
      setIsLoading(false);
    }
  }, [topicId]); // Re-run fetch if topicId changes

  // Fetch data on initial mount or when fetchTopicDetail changes
  useEffect(() => {
    fetchTopicDetail();
  }, [fetchTopicDetail]);

  // Render loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render error state with retry and back button
  if (error) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center group" aria-label="Go back">
          {/* Back arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transition-transform duration-150 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <ErrorMessage message={error} onRetry={fetchTopicDetail} />
      </div>
    );
  }

  // Render topic not found state (if API returns null/empty unexpectedly)
  if (!topic) {
    return (
      <div className="p-4">
        <button onClick={onBack} className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center group" aria-label="Go back">
          {/* Back arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transition-transform duration-150 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <ErrorMessage message="Topic data could not be loaded." />
      </div>
    );
  }

  // Render the topic details and posts
  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center group"
        aria-label="Go back"
      >
        {/* Back arrow SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transition-transform duration-150 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>
      <h1 className="text-xl font-semibold mb-5 text-foreground">{topic.title}</h1>
      <div className="space-y-5">
        {posts.map((post, index) => (
          <div key={post.id} className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${index === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-background'}`}>
            {/* Post Header */}
            <div className="text-xs px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
              <strong>{post.username}</strong> • {new Date(post.created_at).toLocaleString()}
            </div>
            {/* Post Content (using Tailwind Typography) */}
            <div
              className="prose prose-sm dark:prose-invert max-w-none p-4"
              dangerouslySetInnerHTML={{ __html: post.cooked }}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 