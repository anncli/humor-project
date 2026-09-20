import Image from "next/image";
import { connection } from "next/server";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  await connection();

  const { data: memes, error } = await supabase
    .from("memes")
    .select("id, image_url, caption, upvote_count")
    .order("upvote_count", { ascending: false });

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-6 text-center text-slate-950">
        <p>We couldn&apos;t load the memes right now. Please try again soon.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-950">
      <section className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Supabase-powered
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Meme Rankings
          </h1>
          <p className="mt-3 text-slate-600">
            The most upvoted memes from our database.
          </p>
        </header>

        {memes.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No memes have been added yet.
          </p>
        ) : (
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {memes.map((meme, index) => (
              <li
                key={meme.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <Image
                  src={meme.image_url}
                  alt={meme.caption}
                  width={1200}
                  height={800}
                  className="aspect-[3/2] w-full object-cover"
                />
                <div className="p-5">
                  <p className="text-sm font-semibold text-blue-600">
                    #{index + 1} ranked meme
                  </p>
                  <p className="mt-2 text-lg font-medium">{meme.caption}</p>
                  <p className="mt-4 text-sm text-slate-600">
                    {meme.upvote_count} upvotes
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
