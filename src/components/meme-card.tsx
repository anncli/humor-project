import Image from "next/image";

export type Meme = {
  id: number;
  image_url: string;
  caption: string;
  upvote_count: number;
};

type MemeCardProps = {
  meme: Meme;
  rank: number;
  variant?: "podium" | "grid";
};

export function MemeCard({ meme, rank, variant = "grid" }: MemeCardProps) {
  const isChampion = rank === 1;

  return (
    <li
      className={`meme-ticket ${variant === "podium" ? "podium-card" : "grid-card"}`}
      data-rank={rank}
    >
      <article>
        <div className="ticket-rank">
          {isChampion && <span aria-hidden="true">👑</span>}
          <span>#{rank}</span>
          {isChampion && <span className="sr-only">First place</span>}
        </div>
        <div className="meme-image-frame">
          <Image
            src={meme.image_url}
            alt={meme.caption}
            width={1200}
            height={800}
            priority={isChampion}
            className="meme-image"
          />
        </div>
        <div className="ticket-copy">
          <p className="ticket-label">Campus comedy</p>
          <p className="meme-caption">{meme.caption}</p>
          <p className="vote-count">
            <span aria-hidden="true">🦁</span> {meme.upvote_count} Roar-ee points
          </p>
        </div>
      </article>
    </li>
  );
}
