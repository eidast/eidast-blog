import type { MDXComponents } from "mdx/types";

export function createMdxComponents(): MDXComponents {
  return {
    h2: (props) => (
      <h2
        className="font-pixel mt-10 mb-3 text-lg text-[var(--pixel-fg)] tracking-wide"
        {...props}
      />
    ),
    h3: (props) => (
      <h3
        className="font-pixel mt-8 mb-2 text-base text-[var(--pixel-muted)] tracking-wide"
        {...props}
      />
    ),
    p: (props) => (
      <p className="mb-4 text-[15px] leading-relaxed text-[var(--pixel-fg-soft)]" {...props} />
    ),
    ul: (props) => (
      <ul
        className="mb-4 list-inside list-disc space-y-2 text-[15px] text-[var(--pixel-fg-soft)]"
        {...props}
      />
    ),
    ol: (props) => (
      <ol
        className="mb-4 list-inside list-decimal space-y-2 text-[15px] text-[var(--pixel-fg-soft)]"
        {...props}
      />
    ),
    li: (props) => <li className="marker:text-[var(--pixel-accent)]" {...props} />,
    a: (props) => (
      <a
        className="text-[var(--pixel-accent)] underline decoration-2 underline-offset-2 hover:text-[var(--pixel-accent-dim)]"
        {...props}
      />
    ),
    code: (props) => (
      <code
        className="rounded border border-[var(--pixel-border)] bg-[var(--pixel-code-bg)] px-1.5 py-0.5 font-mono text-[13px] text-[var(--pixel-fg)]"
        {...props}
      />
    ),
    pre: (props) => (
      <pre
        className="mb-4 overflow-x-auto rounded border border-[var(--pixel-border)] bg-[var(--pixel-code-bg)] p-4 font-mono text-[13px] text-[var(--pixel-fg)]"
        {...props}
      />
    ),
    blockquote: (props) => (
      <blockquote
        className="mb-4 border-l-4 border-[var(--pixel-accent)] pl-4 text-[15px] italic text-[var(--pixel-muted)]"
        {...props}
      />
    ),
    hr: () => <hr className="my-10 border-[var(--pixel-border)]" />,
    strong: (props) => <strong className="font-semibold text-[var(--pixel-fg)]" {...props} />,
  };
}
