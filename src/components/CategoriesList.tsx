'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { sdk } from '@farcaster/frame-sdk';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

// Interface for category data from Discourse API
interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  text_color: string;
  description: string | null;
  topic_count: number;
  post_count: number;
  position: number;
}

// Expected structure of the /categories.json response
interface DiscourseCategoriesResponse {
  category_list?: {
    categories: Category[];
  };
}

// Props including the selection callback
interface CategoriesListProps {
  onCategorySelect: (categoryId: number, categorySlug: string) => void;
}

/**
 * Component to fetch and display the list of categories from the Discourse forum.
 */
export default function CategoriesList({ onCategorySelect }: CategoriesListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from the backend API proxy
  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/discourse/categories.json');
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      const data: DiscourseCategoriesResponse = await response.json();

      if (data.category_list?.categories) {
        // Sort categories by position as defined in Discourse admin
        const sortedCategories = data.category_list.categories.sort((a, b) => a.position - b.position);
        setCategories(sortedCategories);
        sdk.actions.ready().catch(console.error);
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred fetching categories');
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this fetch function instance is stable

  // Fetch data on initial component mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Render loading state
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Render error state with retry
  if (error) {
    return <ErrorMessage message={error} onRetry={fetchCategories} />;
  }

  // Render category list
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {categories.length === 0 ? (
        <p className="p-6 text-center text-gray-500">No categories found.</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {categories.map((category) => (
            <li
              key={category.id}
              onClick={() => onCategorySelect(category.id, category.slug)}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors block"
              style={{ borderLeftColor: `#${category.color}`, borderLeftWidth: '3px' }}
              aria-label={`View category: ${category.name}`}
            >
              <div className="pl-3">
                <div className="font-medium text-base mb-1 text-foreground hover:text-blue-600 dark:hover:text-blue-400">{category.name}</div>
                {category.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{category.description}</p>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Topics: {category.topic_count} • Posts: {category.post_count}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 