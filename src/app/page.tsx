import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function Home() {
  const supabase = createServerComponentClient({ cookies });
  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts?.map((post) => (
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
    </div>
  );
}