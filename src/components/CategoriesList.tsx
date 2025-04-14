'use client';

import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/frame-sdk'; // Assuming SDK is set up

// Interface based on Discourse API for Category
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
  // Add other fields like subcategory_ids if needed
}

interface DiscourseCategoriesResponse {
  category_list?: {
    categories: Category[];
  };
}

// Props if needed later (e.g., for clicking a category)
// interface CategoriesListProps {
//   onCategorySelect: (categoryId: number) => void;
// }

export default function CategoriesList(/*{ onCategorySelect }: CategoriesListProps*/) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/discourse/categories.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: DiscourseCategoriesResponse = await response.json();

        if (isMounted) {
          if (data.category_list?.categories) {
            // Sort categories by position, typically parent categories come first
            const sortedCategories = data.category_list.categories.sort((a, b) => a.position - b.position);
            setCategories(sortedCategories);
            // Call ready() when this view loads
            // Consider if ready() should be called here or at the page level
            sdk.actions.ready().catch(console.error);
          } else {
            throw new Error('Invalid data structure received from API');
          }
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        if (isMounted) {
             setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
      } finally {
        if (isMounted) {
            setIsLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading categories...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error fetching categories: {error}</div>;
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {categories.length === 0 ? (
        <p className="p-6 text-center text-gray-500">No categories found.</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {categories.map((category) => (
            <li
              key={category.id}
              // onClick={() => onCategorySelect(category.id)} // Add click handler later if needed
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors block"
              style={{ borderLeftColor: `#${category.color}`, borderLeftWidth: '3px' }}
            >
              <div className="pl-3">
                  <div className="font-medium text-base mb-1 text-foreground">{category.name}</div>
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