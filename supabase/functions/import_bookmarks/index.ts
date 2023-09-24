import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { differenceInMonths, addMonths, endOfMonth } from "https://esm.sh/date-fns";

async function getLatestBookmark(username: string, token: string) {
  const apiUrl = `https://api.pinboard.in/v1/posts/recent?auth_token=${username}:${token}&count=1&format=json`;

  console.log('Getting latest bookmark from Pinboard', apiUrl);
  const response = await fetch(apiUrl);
  const { posts } = await response.json();
  console.log(posts[0]);
  if (!posts) throw new Error('No posts found');
  return new Date(posts[0].time);
}

async function getLatestBookmarkFromDB(supabaseClient: any) {
  const { data } = await supabaseClient
    .from('bookmarks')
    .select('service_created_at')
    .order('service_created_at', { ascending: false })
    .limit(1);

  if (!data) return new Date(new Date().setFullYear(new Date().getFullYear() - 10));
  return new Date(data[0]?.service_created_at);
}

async function insertBookmarkToDB(bookmark: any, supabaseClient: any) {
  const { href, description, extended, meta, time, shared, hash, toread, tags } = bookmark;
  const { dt } = time;

  console.log(`-> Inserting bookmark ${href} into DB`);

  try {
    const { data, error } = await supabaseClient
      .from("bookmarks")
      .insert(
        {
          service_id: hash,
          service_created_at: time,
          href,
          description,
          tags
        },{
          onConflict: 'service_id',
        }
      );

    if (error) {
      console.log("error adding bookmark", error, data);
      //throw error;
    }

    return data;
  } catch (error) {
    console.log("error adding bookmark", error);
    //throw error;
  }


}

async function getAndInsertBookmarks(username: string, token: string, fromdt: Date, todt: Date, supabaseClient: any) {
  console.log(`-> Getting bookmarks between ${fromdt} and ${todt}`);
  const monthsBetween = differenceInMonths(todt, fromdt);

  for (let i = 0; i <= monthsBetween; i++) {
    const newFromdt = addMonths(fromdt, i);
    const newTodt = i === monthsBetween ? todt : endOfMonth(newFromdt);

    console.log(`---> Getting bookmarks between ${newFromdt} and ${newTodt}`);

    const apiUrl = `https://api.pinboard.in/v1/posts/all?auth_token=${username}:${token}&tag=&fromdt=${encodeURIComponent(newFromdt.toISOString())}&todt=${encodeURIComponent(newTodt.toISOString())}&format=json`;
    console.log(apiUrl);
    const response = await fetch(apiUrl);
    console.log(response);
    const posts = await response.json();
    if (!posts) throw new Error('No posts found');

    console.log(`---> Got ${posts.length} bookmarks`);
    console.log(posts);

    for (const bookmark of posts) {
      await insertBookmarkToDB(bookmark, supabaseClient);
    }

    // Optional: delay requests to avoid rate limiting
    // await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

serve(async (req) => {
  try {
    const { username, token } = await req.json();

    console.log('🫡');
    console.log(Deno.env.get('SUPABASE_URL') ?? '');
    console.log(Deno.env.get('SUPABASE_ANON_KEY') ?? '');

    const supabaseUrl = "https://xmdylmbdeulxcqdbkfno.supabase.co";
    const supabaseApiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZHlsbWJkZXVseGNxZGJrZm5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk5NTM0NjAsImV4cCI6MjAwNTUyOTQ2MH0.jspo2sHRd4RSN8jL8DYIfTdfZVoGZRcbiZL0MpHo8yI";

    const supabaseClient = createClient(
      supabaseUrl ?? '',
      supabaseApiKey ?? '',
      // { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    let fromdt = await getLatestBookmarkFromDB(supabaseClient);
    const todt = await getLatestBookmark(username, token);

    console.log(`-> Getting bookmarks between ${fromdt} and ${todt}`);

    // if the fromdt is not a valid date, set it to 10 years ago
    if (isNaN(fromdt.getTime())) {
      fromdt = new Date(new Date().setFullYear(new Date().getFullYear() - 10));
    }

    while (fromdt <= todt) {
      await getAndInsertBookmarks(username, token, fromdt, todt, supabaseClient);
      fromdt.setDate(fromdt.getDate() + 1);
    }

    return new Response(JSON.stringify({ message: 'Successfully fetched and written bookmarks.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});