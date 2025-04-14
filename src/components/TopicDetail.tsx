'use client';

import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk';

// Interfaces based on Discourse API for Topic and Post
interface Post {
  id: number;
  username: string;
  cooked: string; // This is the HTML content
  created_at: string;
  // Add other post fields as needed
}

interface TopicDetailResponse {
  id: number;
  title: string;
  post_stream?: {
    posts: Post[];
  };
  // Add other topic detail fields as needed
}

interface TopicDetailProps {
  topicId: number;
  onBack: () => void; // Function to go back to the previous view
}

export default function TopicDetail({ topicId, onBack }: TopicDetailProps) {
  const [topic, setTopic] = useState<TopicDetailResponse | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topicId) return;
    let isMounted = true;

    async function fetchTopicDetail() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/discourse/t/${topicId}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: TopicDetailResponse = await response.json();
        if (isMounted) {
          setTopic(data);
          setPosts(data.post_stream?.posts || []);
          // Assuming the component is ready once topic is fetched
          sdk.actions.ready().catch(console.error);
        }
      } catch (err) {
        console.error(`Failed to fetch topic ${topicId}:`, err);
         if (isMounted) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            // Optionally call ready even on error
            // sdk.actions.ready().catch(console.error);
         }
      } finally {
        if (isMounted) {
             setIsLoading(false);
        }
      }
    }

    fetchTopicDetail();

     return () => {
        isMounted = false;
    };
  }, [topicId]);

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading topic...</div>;
  }

  if (error) {
    return (
        <div className="p-6 text-center text-red-500">
            Error fetching topic: {error}
            <button onClick={onBack} className="mt-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Back</button>
        </div>
    );
  }

  if (!topic) {
    return (
        <div className="p-6 text-center text-gray-500">
            Topic not found.
            <button onClick={onBack} className="mt-4 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Back</button>
        </div>
    );
  }

  return (
    <div className="p-4">
       {/* More prominent back button */}
      <button 
        onClick={onBack} 
        className="mb-4 text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center group"
       >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 transition-transform duration-150 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
      </button>
      <h1 className="text-xl font-semibold mb-5 text-foreground">{topic.title}</h1>
      <div className="space-y-5">
        {posts.map((post, index) => (
          // Add subtle background difference for first post?
          <div key={post.id} className={`border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${index === 0 ? 'bg-gray-50 dark:bg-gray-800/50' : 'bg-background'}`}>
            <div className="text-xs px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400">
              <strong>{post.username}</strong> • {new Date(post.created_at).toLocaleString()}
            </div>
            {/* Render HTML content using dangerouslySetInnerHTML and typography plugin */}
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