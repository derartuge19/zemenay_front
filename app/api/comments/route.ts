import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const createServerClient = () => {
  const cookieStore = cookies();
  return createServerComponentClient({ 
    cookies: () => cookieStore 
  });
};

export async function POST(request: Request) {
  const supabase = createServerClient();
  
  try {
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error('No active session found:', sessionError);
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to comment.' },
        { status: 401 }
      );
    }

    // Get request body
    const { content, post_id } = await request.json();
    
    // Validate input
    if (!content?.trim() || !post_id) {
      return NextResponse.json(
        { error: 'Content and post_id are required' },
        { status: 400 }
      );
    }

    // Get user details
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user found in session');
      return NextResponse.json(
        { error: 'User not found. Please sign in again.' },
        { status: 401 }
      );
    }

    // Create the comment
    const { data: comment, error: insertError } = await supabase
      .from('comments')
      .insert([
        {
          content: content.trim(),
          post_id: post_id,
          author_id: user.id,  
          author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
          author_avatar: user.user_metadata?.avatar_url,
          author_email: user.email,
          status: 'approved',
          created_at: new Date().toISOString()
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error creating comment:', insertError);
      return NextResponse.json(
        { error: insertError.message || 'Failed to create comment' },
        { status: 500 }
      );
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error in comments API route:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const supabase = createServerClient();
  
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    
    if (!postId) {
      return NextResponse.json(
        { error: 'post_id query parameter is required' },
        { status: 400 }
      );
    }

    // Get approved comments for this post
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .eq('status', 'approved')
      .is('parent_id', null) // Only top-level comments
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch comments' },
        { status: 500 }
      );
    }

    // Get all replies for these comments if there are any
    if (comments && comments.length > 0) {
      const commentIds = comments.map(comment => comment.id);
      const { data: replies } = await supabase
        .from('comments')
        .select('*')
        .in('parent_id', commentIds)
        .eq('status', 'approved')
        .order('created_at', { ascending: true });

      // Attach replies to their parent comments
      if (replies) {
        comments.forEach(comment => {
          comment.replies = replies.filter(reply => reply.parent_id === comment.id);
        });
      }
    }

    return NextResponse.json(comments || []);
  } catch (error) {
    console.error('Error in comments API route:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching comments' },
      { status: 500 }
    );
  }
}
