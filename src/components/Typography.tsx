import { cn } from "@/lib/utils";
import React from "react";

type TypographyElement = "h1" | "h2" | "h3" | "h4" | "p" | "span";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: TypographyElement;
  children: React.ReactNode;
}

/** H1 — Newsreader, 48px, bold, editorial presence */
export const H1 = ({ className, children, as: Tag = "h1", ...props }: TypographyProps) => (
  <Tag
    className={cn("font-serif text-5xl font-bold leading-tight tracking-tight text-foreground", className)}
    {...props}
  >
    {children}
  </Tag>
);

/** H2 — Newsreader, 36px, semibold */
export const H2 = ({ className, children, as: Tag = "h2", ...props }: TypographyProps) => (
  <Tag
    className={cn("font-serif text-4xl font-semibold leading-tight tracking-tight text-foreground", className)}
    {...props}
  >
    {children}
  </Tag>
);

/** H3 — Newsreader, 24px, semibold */
export const H3 = ({ className, children, as: Tag = "h3", ...props }: TypographyProps) => (
  <Tag
    className={cn("font-serif text-2xl font-semibold leading-snug text-foreground", className)}
    {...props}
  >
    {children}
  </Tag>
);

/** Body — Geist, 16px, regular */
export const Body = ({ className, children, as: Tag = "p", ...props }: TypographyProps) => (
  <Tag
    className={cn("font-sans text-base leading-relaxed text-foreground", className)}
    {...props}
  >
    {children}
  </Tag>
);

/** Caption — Geist, 14px, muted */
export const Caption = ({ className, children, as: Tag = "p", ...props }: TypographyProps) => (
  <Tag
    className={cn("font-sans text-sm leading-normal text-muted-foreground", className)}
    {...props}
  >
    {children}
  </Tag>
);

/** Label — Geist, 12px, uppercase, wide tracking — data-forward feel */
export const Label = ({ className, children, as: Tag = "span", ...props }: TypographyProps) => (
  <Tag
    className={cn("font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground", className)}
    {...props}
  >
    {children}
  </Tag>
);
