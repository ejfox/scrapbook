// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { supabaseClient } from "./supabase.ts"

// make a function to fetch all bookmarks from pinboard with axios
fetchBookmarks = async (username, token) => {
  console.log("fetching bookmarks", username, token)
  const response = await fetch(
    `https://api.pinboard.in/v1/posts/all?auth_token=${username}:${token}&format=json`,
  )
  console.log("response length", response.length)
  const data = await response.json()
  return data
}


serve(async (req) => {
  const { username, token } = await req.json()

  console.log("response received:", username, token)
  const data = await fetchBookmarks(username, token)

  console.log("making supabase client")
  const supabaseClient = createClient(
    "https://<your-project>.supabase.co",
    "<your-anon-key>",
  )
  console.log("adding bookmarks to supabase")
  // loop through all the bookmarks and add them to supabase
  data.forEach(async (bookmark) => {

    const { href, description, extended, meta, time, shared, toread } = bookmark
    const { hash, others } = meta
    const { tags } = others
    const { dt } = time
    console.log("adding bookmark", href, dt)

    const { data, error } = await supabaseClient
      .from("bookmarks")
      .insert([
        {
          href,
          description,
          service_id: hash,
          service_created_at: dt,
          toread,
          tags
        },
      ])

    if (error) {
      console.log("error adding bookmark", error)
    }
  })

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )

})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/hello' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
