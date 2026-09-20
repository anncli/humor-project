import { MemeCard, type Meme } from "@/components/meme-card";

type RankingPodiumProps = {
  memes: Meme[];
};

export function RankingPodium({ memes }: RankingPodiumProps) {
  return (
    <section className="podium-section" aria-labelledby="podium-heading">
      <div className="section-heading">
        <span aria-hidden="true">★</span>
        <h2 id="podium-heading">Morningside&apos;s finest</h2>
        <span aria-hidden="true">★</span>
      </div>
      <ol className="podium-list">
        {memes.map((meme, index) => (
          <MemeCard key={meme.id} meme={meme} rank={index + 1} variant="podium" />
        ))}
      </ol>
    </section>
  );
}
