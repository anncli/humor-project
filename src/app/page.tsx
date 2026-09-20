import { connection } from "next/server";
import { MemeCard, type Meme } from "@/components/meme-card";
import { RankingPodium } from "@/components/ranking-podium";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  await connection();

  const { data: memes, error } = await supabase
    .from("memes")
    .select("id, image_url, caption, upvote_count")
    .order("upvote_count", { ascending: false });

  if (error) {
    return (
      <main className="carnival-page grid min-h-screen place-items-center px-6 text-center">
        <p className="error-ticket">The campus comedy board is taking an intermission. Please try again soon.</p>
      </main>
    );
  }

  const rankedMemes = memes as Meme[];
  const podiumMemes = rankedMemes.slice(0, 3);
  const remainingMemes = rankedMemes.slice(3);
  const hasFullPodium = podiumMemes.length === 3;
  const gridMemes = hasFullPodium ? remainingMemes : rankedMemes;
  const gridStartingRank = hasFullPodium ? 4 : 1;

  return (
    <main className="carnival-page px-4 py-8 sm:px-6 sm:py-12">
      <div className="confetti" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
        <span />
        <span />
      </div>
      <section className="carnival-shell">
        <header className="carnival-header">
          <p className="marquee-kicker">Columbia University</p>
          <h1 className="carnival-title">
            <span>Morningside</span> Memes
          </h1>
          <p className="carnival-subtitle">
            Where Columbians turn pain into punchlines.
          </p>
          <div className="marquee-strip" aria-label="Student-made silliness and student-voted leaderboard">
            <span aria-hidden="true">✦</span>
            student-made silliness
            <span aria-hidden="true">✦</span>
            student-voted leaderboard
            <span aria-hidden="true">✦</span>
          </div>
        </header>

        {rankedMemes.length === 0 ? (
          <p className="empty-ticket">
            No memes have made it to campus yet. Check back after the next act!
          </p>
        ) : (
          <>
            {hasFullPodium ? <RankingPodium memes={podiumMemes} /> : null}
            <section className="ranking-section" aria-labelledby="ranking-heading">
              <div className="section-heading">
                <span aria-hidden="true">✦</span>
                <h2 id="ranking-heading">
                  {hasFullPodium ? "More from campus" : "Campus ranking board"}
                </h2>
                <span aria-hidden="true">✦</span>
              </div>
              <ol className="meme-grid" start={gridStartingRank}>
                {gridMemes.map((meme, index) => (
                  <MemeCard
                    key={meme.id}
                    meme={meme}
                    rank={index + gridStartingRank}
                  />
                ))}
              </ol>
            </section>
          </>
        )}
        <footer className="source-footer">
          <a href="https://www.crackd.ai/" target="_blank" rel="noreferrer">
            Based on crackd.ai
          </a>
        </footer>
      </section>
    </main>
  );
}
