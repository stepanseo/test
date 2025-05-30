import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';

export default async function Profile() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', session.user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-4">Profile</h1>
        <div className="mb-4">
          <p className="text-gray-600">Email: {session.user.email}</p>
          <p className="text-gray-600">Name: {profile?.full_name || 'Not set'}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Your Posts</h2>
        <div className="space-y-4">
          {posts?.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">
                <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h3>
              <p className="text-gray-600 mb-2">
                {post.content.substring(0, 150)}...
              </p>
              <p className="text-sm text-gray-500">
                Published on {format(new Date(post.created_at), 'MMMM dd, yyyy')}
              </p>
            </div>
          ))}
          {!posts?.length && (
            <p className="text-gray-600">You haven't created any posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}