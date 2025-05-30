import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

export default async function PostDetail({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(full_name)')
    .eq('id', params.id)
    .single();

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto">
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center text-gray-600 mb-8">
        <span>{post.profiles?.full_name}</span>
        <span className="mx-2">•</span>
        <span>{format(new Date(post.created_at), 'MMMM dd, yyyy')}</span>
      </div>
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}