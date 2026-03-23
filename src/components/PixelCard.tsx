export function PixelCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`border-2 border-[var(--pixel-border)] bg-[var(--pixel-surface)] shadow-[4px_4px_0_0_var(--pixel-shadow)] ${className}`}
    >
      {children}
    </div>
  );
}
