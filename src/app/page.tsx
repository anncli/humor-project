import Link from "next/link";
import { connection } from "next/server";
import { MemeCard, type Meme } from "@/components/meme-card";
import { RankingPodium } from "@/components/ranking-podium";
import { supabase } from "@/lib/supabase";

const PODIUM_SIZE = 3;
const MEMES_PER_PAGE = 4;

function getRequestedPage(page: string | string[] | undefined) {
  if (typeof page !== "string") {
    return 1;
  }

  const parsedPage = Number(page);

  return Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

function pageHref(page: number) {
  return page === 1 ? "/" : `/?page=${page}`;
}

export default async function Home({ searchParams }: PageProps<"/">) {
  await connection();

  const [{ count, error: countError }, { data: podiumData, error: podiumError }] =
    await Promise.all([
      supabase.from("memes").select("*", { count: "exact", head: true }),
      supabase
        .from("memes")
        .select("id, image_url, caption, upvote_count")
        .order("upvote_count", { ascending: false })
        .order("id", { ascending: true })
        .limit(PODIUM_SIZE),
    ]);

  if (countError || podiumError) {
    return (
      <main className="carnival-page grid min-h-screen place-items-center px-6 text-center">
        <p className="error-ticket">The campus comedy board is taking an intermission. Please try again soon.</p>
      </main>
    );
  }

  const totalMemes = count ?? 0;
  const podiumMemes = (podiumData ?? []) as Meme[];
  const hasFullPodium = podiumMemes.length === PODIUM_SIZE;
  const podiumCount = hasFullPodium ? PODIUM_SIZE : 0;
  const totalGridMemes = Math.max(totalMemes - podiumCount, 0);
  const totalPages = Math.max(1, Math.ceil(totalGridMemes / MEMES_PER_PAGE));
  const { page } = await searchParams;
  const currentPage = Math.min(getRequestedPage(page), totalPages);
  const gridOffset = podiumCount + (currentPage - 1) * MEMES_PER_PAGE;

  const { data: gridData, error: gridError } = await supabase
    .from("memes")
    .select("id, image_url, caption, upvote_count")
    .order("upvote_count", { ascending: false })
    .order("id", { ascending: true })
    .range(gridOffset, gridOffset + MEMES_PER_PAGE - 1);

  if (gridError) {
    return (
      <main className="carnival-page grid min-h-screen place-items-center px-6 text-center">
        <p className="error-ticket">The campus comedy board is taking an intermission. Please try again soon.</p>
      </main>
    );
  }

  const gridMemes = (gridData ?? []) as Meme[];
  const gridStartingRank = gridOffset + 1;
  const rankingHeading = "More from campus";

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

        {totalMemes === 0 ? (
          <p className="empty-ticket">
            No memes have made it to campus yet. Check back after the next act!
          </p>
        ) : (
          <>
            {hasFullPodium ? <RankingPodium memes={podiumMemes} /> : null}
            {gridMemes.length > 0 ? (
              <section className="ranking-section" aria-labelledby="ranking-heading">
                <div className="section-heading">
                  <span aria-hidden="true">✦</span>
                  <h2 id="ranking-heading">{rankingHeading}</h2>
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
                {totalPages > 1 ? (
                  <nav className="pagination" aria-label="Campus ranking pages">
                    {currentPage > 1 ? (
                      <Link className="pagination-button" href={pageHref(currentPage - 1)} scroll={false}>
                        Previous
                      </Link>
                    ) : (
                      <span className="pagination-button pagination-button-disabled" aria-disabled="true">
                        Previous
                      </span>
                    )}
                    <p className="pagination-status">
                      Page {currentPage} of {totalPages}
                    </p>
                    {currentPage < totalPages ? (
                      <Link className="pagination-button" href={pageHref(currentPage + 1)} scroll={false}>
                        Next
                      </Link>
                    ) : (
                      <span className="pagination-button pagination-button-disabled" aria-disabled="true">
                        Next
                      </span>
                    )}
                  </nav>
                ) : null}
              </section>
            ) : null}
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
