/**
 * Decorative pixel-style motion for the footer (no copy, aria-hidden).
 * Inspired by CSS stepped animations / retro status strips (e.g. 8-bit UI bars).
 */
export function FooterPixelStrip() {
  return (
    <>
      <div className="footer-pixel-chase-track" aria-hidden>
        <div className="footer-pixel-chase" />
      </div>
      <div className="footer-pixel-matrix" aria-hidden>
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            className="footer-pixel-cell"
            style={{ animationDelay: `${i * 90}ms` }}
          />
        ))}
      </div>
    </>
  );
}
