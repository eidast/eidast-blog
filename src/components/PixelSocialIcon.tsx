import type { ComponentProps, ReactNode } from "react";

type Props = {
  size?: number;
  className?: string;
} & ComponentProps<"svg">;

function Svg(props: Props & { children: ReactNode; viewBox?: string }) {
  const { size = 20, className, children, viewBox = "0 0 24 24", ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

/**
 * Cleaner, geometric social icons inspired by minimal portfolio sites.
 * Stroked shapes keep a crisp look while avoiding rough pixel glyph artifacts.
 */
export function PixelLinkedInIcon({ size = 20, className, ...rest }: Props) {
  return (
    <Svg size={size} className={className} {...rest}>
      <rect x="3.5" y="3.5" width="17" height="17" />
      <line x1="8.2" y1="9.3" x2="8.2" y2="16.8" />
      <rect x="7.3" y="6.7" width="1.8" height="1.8" fill="currentColor" stroke="none" />
      <path d="M11.4 16.8V11.4C11.4 10.2 12.2 9.4 13.4 9.4C14.6 9.4 15.3 10.2 15.3 11.4V16.8" />
      <line x1="11.4" y1="12.1" x2="15.3" y2="12.1" />
    </Svg>
  );
}

export function PixelInstagramIcon({ size = 20, className, ...rest }: Props) {
  return (
    <Svg size={size} className={className} {...rest}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="1.5" ry="1.5" />
      <circle cx="12" cy="12" r="4.3" />
      <rect x="15.9" y="6.4" width="1.8" height="1.8" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function PixelXIcon({ size = 20, className, ...rest }: Props) {
  return (
    <Svg size={size} className={className} {...rest}>
      <line x1="5" y1="4.5" x2="18.5" y2="20" />
      <line x1="18.5" y1="4.5" x2="5" y2="20" />
      <line x1="9.3" y1="9.4" x2="15" y2="15.9" />
      <line x1="15" y1="9.4" x2="9.3" y2="15.9" />
    </Svg>
  );
}
