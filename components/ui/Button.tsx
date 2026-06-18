import { Link } from "@/i18n/routing";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-sans font-medium transition duration-200 focus-visible:outline-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-base hover:bg-accent-light hover:shadow-amber",
  secondary:
    "border border-border-subtle text-text-primary hover:border-accent hover:text-accent",
  ghost: "text-text-muted hover:text-text-primary",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-small",
  md: "h-11 px-6 text-body",
  lg: "h-13 px-8 text-body-lg",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

// İç link
type LinkProps = CommonProps & {
  href: ComponentProps<typeof Link>["href"];
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

// Buton
type NativeProps = CommonProps &
  Omit<ComponentProps<"button">, "className" | "children">;

function classes(variant: Variant, size: Size, className?: string) {
  return [base, variants[variant], sizes[size], className]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: LinkProps | NativeProps) {
  const { variant = "primary", size = "md", className, children } = props;
  const cls = classes(variant, size, className);

  if ("href" in props) {
    const { href, ...rest } = props as LinkProps;
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  const { ...rest } = props as NativeProps;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
