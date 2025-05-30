'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import SearchAndSort from '@/components/SearchAndSort';

type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  image_url?: string;
  profiles: {
    full_name: string;
  };
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  const fetchPosts = async (searchQuery = '', sortOrder: 'desc' | 'asc' = 'desc') => {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: sortOrder === 'asc' });

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data } = await query;
    setPosts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (query: string) => {
    fetchPosts(query);
  };

  const handleSort = (order: 'desc' | 'asc') => {
    fetchPosts('', order);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-gray-600">Loading posts...</div>
      </div>
    );
  }

  return (
    <div>
      <SearchAndSort onSearch={handleSearch} onSort={handleSort} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {post.image_url && (
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">
                <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">
                {post.content.substring(0, 150)}...
              </p>
              <div className="text-sm text-gray-500">
                <span>{post.profiles?.full_name}</span>
                <span className="mx-2">•</span>
                <span>{format(new Date(post.created_at), 'MM/dd/yyyy')}</span>
              </div>
            </div>
          </article>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full text-center text-gray-600">
            No posts found.
          </div>
        )}
      </div>
    </div>
  );
}