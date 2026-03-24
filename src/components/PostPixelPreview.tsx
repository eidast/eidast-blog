type Props = {
  seed: string;
  className?: string;
};

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Static pixel mosaic used as a lightweight visual identity for each post card.
 * The pattern is deterministic from `seed` and does not animate.
 */
export function PostPixelPreview({ seed, className = "" }: Props) {
  const base = hashSeed(seed);
  const cells = Array.from({ length: 36 }, (_, i) => {
    const v = (base + i * 1103515245) >>> 0;
    return (v >> 28) & 0b11;
  });

  return (
    <div
      className={`post-pixel-preview border-2 border-[var(--pixel-border)] bg-[var(--pixel-bg)] p-1 ${className}`}
      aria-hidden
    >
      <div className="post-pixel-grid">
        {cells.map((tone, i) => (
          <span
            key={i}
            className={
              tone === 0
                ? "post-pixel-cell post-pixel-cell-0"
                : tone === 1
                  ? "post-pixel-cell post-pixel-cell-1"
                  : tone === 2
                    ? "post-pixel-cell post-pixel-cell-2"
                    : "post-pixel-cell post-pixel-cell-3"
            }
          />
        ))}
      </div>
    </div>
  );
}

