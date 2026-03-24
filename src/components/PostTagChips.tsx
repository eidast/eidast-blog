type Props = {
  tags: string[];
  className?: string;
};

/**
 * Compact, static pixel chips for post taxonomy.
 */
export function PostTagChips({ tags, className = "" }: Props) {
  if (tags.length === 0) return null;

  return (
    <ul className={`post-tag-list ${className}`} aria-label="Post tags">
      {tags.slice(0, 3).map((tag) => (
        <li key={tag}>
          <span className="post-tag-chip">{tag}</span>
        </li>
      ))}
    </ul>
  );
}

